import {IsDefined, IsNotEmpty, IsString} from "class-validator";

export class TokenQueryDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    token: string;
}