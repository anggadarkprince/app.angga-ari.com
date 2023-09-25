import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../users/users.service';
import { isEmail } from 'class-validator';
import { User } from '../users/entities/user.entity';
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ON_USER_REGISTERED,
  UserRegisterEvent,
} from './events/user-register.event';
import { UtilityService } from '../utility/utility.service';
import { plainToInstance } from 'class-transformer';
import { TokenPayloadDto } from './dto/token-payload.dto';
import {
  TOKEN_ACCOUNT_ACTIVATION,
  TOKEN_RESET_PASSWORD,
} from './constants/auth';
import {
  ON_USER_FORGOT_PASSWORD,
  UserForgotPasswordEvent,
} from './events/user-forgot-password.event';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private eventEmitter: EventEmitter2,
    private utilityService: UtilityService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticate user by given the credentials.
   *
   * @param username
   * @param password
   */
  async login(username: string, password: string) {
    let user: User;
    if (isEmail(username)) {
      user = await this.userService.findByEmail(username);
    } else {
      user = await this.userService.findByUsername(username);
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('Status user is inactive');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash === hash.toString('hex')) {
      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };
      const tokens = {
        access_token: await this.jwtService.signAsync(payload),
      };
      return { data: user, meta: tokens };
    }
    throw new UnauthorizedException('Password is wrong');
  }

  /**
   * Register user and emit even ON_USER_REGISTERED.
   *
   * @param registerUser
   */
  async register(registerUser: RegisterUserDto) {
    const user = await this.userService.create(registerUser);
    if (user) {
      this.eventEmitter.emit(ON_USER_REGISTERED, new UserRegisterEvent(user));
      return user;
    }
    return null;
  }

  private extractTokenPayload(token: string) {
    const decodedToken = JSON.parse(
      Buffer.from(token, 'base64').toString('ascii'),
    );
    const payload = JSON.parse(this.utilityService.decrypt(decodedToken));
    return plainToInstance(TokenPayloadDto, payload);
  }

  /**
   * Activate user account by valid token.
   *
   * @param token
   */
  async confirmAccount(token: string) {
    const tokenPayload = this.extractTokenPayload(token);
    const { email, type, expiredAt } = tokenPayload;

    const isInvalidType = type !== TOKEN_ACCOUNT_ACTIVATION;
    const isExpired = new Date() > new Date(expiredAt);

    if (isExpired || isInvalidType) {
      throw new BadRequestException('Token is expired or invalid request type');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      throw new BadRequestException('User is already activated');
    }

    return this.userService.activateUser(user);
  }

  /**
   * Send forgot password link.
   *
   * @param email
   */
  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.eventEmitter.emit(
      ON_USER_FORGOT_PASSWORD,
      new UserForgotPasswordEvent(user),
    );

    return user;
  }

  /**
   * Reset password user.
   *
   * @param password
   * @param token
   */
  async resetPassword(password: string, token: string) {
    const tokenPayload = this.extractTokenPayload(token);
    const { email, type, expiredAt } = tokenPayload;

    const isInvalidType = type !== TOKEN_RESET_PASSWORD;
    const isExpired = new Date() > new Date(expiredAt);

    if (isExpired || isInvalidType) {
      throw new BadRequestException('Token is expired or invalid request type');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userService.changePassword(user, password);
  }
}
