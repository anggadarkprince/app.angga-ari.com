import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {isEmail} from "class-validator";
import {User} from "../users/entities/user.entity";
import {promisify} from "util";
import {randomBytes, scrypt as _scrypt} from "crypto";
import {RegisterUserDto} from "./dto/register-user.dto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {
    }

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

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash === hash.toString('hex')) {
            return user;
        }
        throw new UnauthorizedException('Password is wrong');
    }

    async register(registerUser: RegisterUserDto) {
        return this.userService.create(registerUser);
    }
}
