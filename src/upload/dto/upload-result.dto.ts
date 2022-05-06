import {IsNumber, IsOptional, IsString} from "class-validator";
import {StorageType} from "../upload.service";

export class UploadResultDto {
    @IsString()
    uploadedPath: string;

    @IsOptional()
    source: Express.Multer.File = null;

    @IsString()
    mimeType: string;

    @IsNumber()
    size: number;

    @IsNumber()
    url?: string;

    @IsString()
    driver?: StorageType;
}