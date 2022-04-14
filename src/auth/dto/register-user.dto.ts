import {IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength} from "class-validator";
import {UsernameAvailable} from "../../users/rules/username-available.rule";
import {EmailAvailable} from "../../users/rules/email-available.rule";
import {MatchField} from "../rules/match-field.rule";

export class RegisterUserDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @UsernameAvailable()
    username: string;

    @IsEmail()
    @EmailAvailable()
    @MaxLength(50)
    email: string;

    @IsString()
    @MinLength(5)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak, must include uppercase and number'
    })
    password: string;

    @IsString()
    @MatchField('password')
    passwordConfirmation: string;

    @IsBoolean()
    isActive = false;
}