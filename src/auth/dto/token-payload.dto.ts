import {IsDate, IsEmail, IsIn, IsNotEmpty} from "class-validator";
import {TOKEN_ACCOUNT_ACTIVATION, TOKEN_RESET_PASSWORD} from "../constants/auth";

export class TokenPayloadDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsIn([TOKEN_ACCOUNT_ACTIVATION, TOKEN_RESET_PASSWORD])
    type: string;

    @IsDate()
    expiredAt: Date
}