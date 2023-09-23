import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    //super.catch(exception, host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(500).json({
      code: 500,
      message: 'Internal server error',
      errors: exception.message || '',
      meta: {
        exception: exception.name,
        stack: process.env.NODE_ENV ? exception.stack : null,
      },
    });
  }
}
