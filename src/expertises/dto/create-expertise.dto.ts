import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateExpertiseDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  section_id: number;

  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  subtitle: string;

  @Max(5)
  @Min(1)
  @IsOptional()
  level: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  icon: string;
}
