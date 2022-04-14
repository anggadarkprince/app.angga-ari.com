import {IsBoolean, IsEmail, IsString, Length, MaxLength, MinLength, Validate} from "class-validator";
import {EmailAvailableRule} from "../rules/email-available.rule";
import {UsernameAvailable} from "../rules/username-available.rule";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @UsernameAvailable(null, {
        message: 'User $value already exists. Choose another username.',
    })
    username: string;

    @IsEmail()
    @Validate(EmailAvailableRule)
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    isActive: boolean = true;
}
