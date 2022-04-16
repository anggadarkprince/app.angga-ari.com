import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {randomBytes, scrypt as _scrypt} from "crypto";
import {promisify} from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }

    async create(createUserDto: CreateUserDto) {
        const password: string = createUserDto.password;

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        createUserDto.password = salt + '.' + hash.toString('hex');

        const user = this.repo.create(createUserDto);

        return this.repo.save(user);
    }

    findAll() {
        return this.repo.find();
    }

    findOne(id: number) {
        return this.repo.findOne(id);
    }

    findByEmail(email: string) {
        return this.repo.findOne({email: email});
    }

    findByUsername(username: string) {
        return this.repo.findOne({username: username});
    }

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

    async activateUser(user: User | number) {
        if (typeof user === 'number') {
            user = await this.findOne(user);
        }
        user.isActive = true;

        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.repo.remove(user);
    }
}
