import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MaxLength(100)
  full_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  tagline: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  about: string;

  @IsInt()
  @IsOptional()
  experience_years: number = 0;

  @IsInt()
  @IsOptional()
  completed_projects: number = 0;

  @IsInt()
  @IsOptional()
  learning_hours: number = 0;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  email_address: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  website: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone: string;
}
