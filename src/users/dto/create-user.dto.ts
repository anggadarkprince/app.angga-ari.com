import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
