import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  /**
   * Hash plain text password.
   *
   * @param password
   * @private
   */
  private static async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  /**
   * Create new user.
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await UsersService.hashPassword(
      createUserDto.password,
    );

    const user = this.repo.create(createUserDto);

    return this.repo.save(user);
  }

  /**
   * Find all user data.
   */
  findAll() {
    return this.repo.find();
  }

  /**
   * Find user by id.
   *
   * @param id
   */
  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  /**
   * Find user by email address.
   *
   * @param email
   */
  findByEmail(email: string) {
    return this.repo.findOneBy({ email: email });
  }

  /**
   * Find user by username.
   *
   * @param username
   */
  findByUsername(username: string) {
    return this.repo.findOneBy({ username: username });
  }

  /**
   * Update user account.
   *
   * @param id
   * @param updateUserDto
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingEmail = await this.findByEmail(updateUserDto.email);
    if (existingEmail && existingEmail.id != id) {
      throw new BadRequestException('Email is already exists');
    }
    const existingUsername = await this.findByUsername(updateUserDto.username);
    if (existingUsername && existingEmail.id != id) {
      throw new BadRequestException('Username is already exists');
    }

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);

    return this.repo.save(user);
  }

  /**
   * Activate user account.
   *
   * @param user
   */
  async activateUser(user: User | number) {
    if (typeof user === 'number') {
      user = await this.findOne(user);
    }
    user.isActive = true;

    return this.repo.save(user);
  }

  /**
   * Change user's password.
   *
   * @param user
   * @param password
   */
  async changePassword(user: User | number, password: string) {
    if (typeof user === 'number') {
      user = await this.findOne(user);
    }
    user.password = await UsersService.hashPassword(password);

    return this.repo.save(user);
  }

  /**
   * Remove password.
   *
   * @param id
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
