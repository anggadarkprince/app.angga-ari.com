import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseType } from '../interceptors/transformer.interceptor';
import { getStatusLabel } from '../constants/status-code';

interface OriginalResponseType {
  statusCode?: number;
  status?: string;
  message?: string;
  error?: string;
  errors?: object | Array<any>;
  meta?: object;
}

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
    const originalResponse = exception.getResponse() as OriginalResponseType;
    const objectOrErrorIsString =
      originalResponse.statusCode &&
      originalResponse.message &&
      originalResponse.error;
    let apiResponse: ApiResponseType<any> = {
      code: code,
    };

    if (!apiResponse.status) {
      apiResponse.status = getStatusLabel(apiResponse.code);
    }

    if (objectOrErrorIsString) {
      apiResponse.message = originalResponse.message;
    } else {
      if (originalResponse.status) {
        apiResponse.status = originalResponse.status;
      }
      if (originalResponse.message) {
        apiResponse.message = originalResponse.message;
      }
      apiResponse.errors = originalResponse;
    }

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
