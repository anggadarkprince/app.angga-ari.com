import {OmitType} from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {IsEmail, IsString} from "class-validator";

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @IsString()
    username: string;

    @IsEmail()
    email: string;
}
