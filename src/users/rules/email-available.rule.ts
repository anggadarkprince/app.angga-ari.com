import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'EmailAvailable', async: true })
@Injectable()
export class EmailAvailableRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `User with email ${validationArguments.value} is already exist`;
  }

  async validate(value: any, validationArguments?: ValidationArguments) {
    const [exceptId] = validationArguments.constraints || [];

    try {
      const existingUser = await this.usersService.findByEmail(value);
      if (existingUser && existingUser.id != exceptId) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}

export function EmailAvailable(
  exceptId?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EmailAvailable',
      target: object.constructor,
      constraints: [exceptId],
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailAvailableRule,
    });
  };
}
