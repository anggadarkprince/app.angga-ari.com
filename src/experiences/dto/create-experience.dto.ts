import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

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
  @MaxLength(30)
  from: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  to?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @MaxLength(300)
  url?: string;
}
