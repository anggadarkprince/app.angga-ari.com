import {IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min} from "class-validator";

export class CreateShowcasePhotoDto {
    @IsString()
    @MaxLength(100)
    photo_title: string;

    @IsString()
    src: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    order: number;
}
