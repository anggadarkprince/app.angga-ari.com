import { IsString, MaxLength } from 'class-validator';

export class ReplyMessageDto {
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @MaxLength(1000)
  message: string;
}
