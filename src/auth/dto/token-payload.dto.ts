import {IsDate, IsEmail, IsIn, IsNotEmpty} from "class-validator";

export class TokenPayloadDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsIn(['account_activation', 'reset_password'])
    type: string;

    @IsDate()
    expiredAt: Date
}