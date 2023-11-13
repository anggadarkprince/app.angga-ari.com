import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString, IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  @IsNotEmpty()
  tagline: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  @IsNotEmpty()
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
  @IsUrl()
  website: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsUrl()
  github_url: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  github_username: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsUrl()
  twitter_url: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsUrl()
  instagram_url: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @IsUrl()
  linkedin_url: string;
}
