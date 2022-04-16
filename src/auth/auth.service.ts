import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {EventEmitter2} from "@nestjs/event-emitter";
import {UsersService} from "../users/users.service";
import {isEmail} from "class-validator";
import {User} from "../users/entities/user.entity";
import {promisify} from "util";
import {scrypt as _scrypt} from "crypto";
import {RegisterUserDto} from "./dto/register-user.dto";
import {ON_USER_REGISTERED, UserRegisterEvent} from "./events/user-register.event";
import {UtilityService} from "../utility/utility.service";
import {plainToInstance} from "class-transformer";
import {TokenPayloadDto} from "./dto/token-payload.dto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private eventEmitter: EventEmitter2,
        private utilityService: UtilityService
    ) {
    }

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
            return user;
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

    /**
     * Activate user account by valid token.
     *
     * @param token
     */
    async confirmAccount(token: string) {
        const decodedToken = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
        const payload = JSON.parse(this.utilityService.decrypt(decodedToken));
        const tokenPayload = plainToInstance(TokenPayloadDto, payload);
        const {email, type, expiredAt} = tokenPayload;

        const isInvalidType = type !== 'account_activation';
        const isExpired = (new Date()) > (new Date(expiredAt));

        if (isExpired || isInvalidType) {
            throw new BadRequestException("Token is expired or invalid request type")
        }

        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found")
        }

        return this.userService.activateUser(user);
    }
}
