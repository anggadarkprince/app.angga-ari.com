import {IsEmail, IsString, Length, MaxLength, MinLength, Validate} from "class-validator";
import {EmailAvailableRule} from "../rules/email-exists.rule";
import {UsernameExists} from "../rules/username-exists.rule";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @UsernameExists(null, {
        message: 'User $value already exists. Choose another username.',
    })
    username: string;

    @IsEmail()
    @Validate(EmailAvailableRule)
    email: string;

    @IsString()
    password: string;
}
