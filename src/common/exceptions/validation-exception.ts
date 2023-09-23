import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (
  validationErrors: ValidationError[] = [],
) => {
  const errorMessages = {};
  validationErrors.forEach((error) => {
    if (!errorMessages.hasOwnProperty(error.property)) {
      errorMessages[error.property] = [];
    }
    errorMessages[error.property] = errorMessages[error.property].concat(
      Object.values(error.constraints),
    );
  });
  return new BadRequestException({
    status: 'validation-error',
    errors: errorMessages,
  });
};
