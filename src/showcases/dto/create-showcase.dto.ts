import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateShowcasePhotoDto } from './create-showcase-photo.dto';
import { Type } from 'class-transformer';

export class CreateShowcaseDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  subtitle: string;

  @IsUrl()
  url: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  order: number;

  @IsString()
  @MaxLength(200)
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateShowcasePhotoDto)
  photos: CreateShowcasePhotoDto[];
}
