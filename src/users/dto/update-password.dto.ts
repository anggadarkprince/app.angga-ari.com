import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { MatchField } from '../../auth/rules/match-field.rule';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak, must include uppercase and number',
  })
  newPassword: string;

  @IsString()
  @MatchField('newPassword')
  confirmPassword: string;
}
