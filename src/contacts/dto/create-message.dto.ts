import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  project?: string;

  @IsString()
  @MaxLength(1000)
  message: string;
}
