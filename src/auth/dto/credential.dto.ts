import {IsString} from "class-validator";

export class CredentialDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}