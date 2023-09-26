import {IsOptional, IsString, IsUrl, MaxLength} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @MaxLength(50)
  label: string;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(300)
  subtitle: string;

  @IsString()
  @MaxLength(10)
  from: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  to?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(300)
  url?: string;
}
