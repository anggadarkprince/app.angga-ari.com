import {
  IsBoolean,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchField } from '../rules/match-field.rule';

export class ResetPasswordDto {
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak, must include uppercase and number',
  })
  newPassword: string;

  @IsString()
  @MatchField('newPassword')
  passwordConfirmation: string;

  @IsBoolean()
  isActive = false;
}
