import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class SettingDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  author: string;

  @IsString()
  @MaxLength(300)
  @IsNotEmpty()
  url: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
