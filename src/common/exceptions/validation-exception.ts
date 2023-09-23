import { ValidationError } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

export class ValidationException extends HttpException {
  constructor(
    errors: string | Record<string, any>,
    message?: string,
    status = 422,
  ) {
    super(
      {
        status: 'validation-error',
        message: message || 'Invalid data submission',
        errors: errors,
      },
      status,
    );
  }
}

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
  return new ValidationException(errorMessages);
};
