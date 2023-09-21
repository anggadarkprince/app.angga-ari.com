import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StorageType } from '../upload.service';

export class UploadDto {
  @IsString()
  title: string;

  @IsString()
  path: string = 'temp';

  @IsOptional()
  driver: StorageType = null;
}
