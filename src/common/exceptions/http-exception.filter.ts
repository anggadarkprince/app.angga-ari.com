import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseType } from '../interceptors/transformer.interceptor';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const code = exception.getStatus();
    const defaultMeta = {
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    const originalResponse = exception.getResponse() as ApiResponseType<any>;
    let apiResponse: ApiResponseType<any> = {
      code: code,
    };

    if (typeof originalResponse === 'object') {
      if (code == 404) {
        apiResponse.status = 'not-found';
        apiResponse.message = originalResponse.message || 'Not found';
      }

      if (originalResponse.status == 'validation-error') {
        apiResponse = { ...apiResponse, ...originalResponse };
      }

      apiResponse = {
        ...apiResponse,
        meta: {
          ...defaultMeta,
          ...(originalResponse.meta || {}),
        },
      };
    }

    response.status(code).json(apiResponse);
  }
}
