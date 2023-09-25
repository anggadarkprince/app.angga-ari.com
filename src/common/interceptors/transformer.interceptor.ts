import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { getStatusLabel } from '../constants/status-code';

export interface ApiResponseType<T> {
  code: number;
  status?: string;
  data?: Array<T> | object;
  meta?: object;
  message?: string;
  errors?: Array<any> | object;
  error?: Array<any> | object | string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        const response: ApiResponseType<T> = {
          code: statusCode,
          status: getStatusLabel(statusCode),
        };

        if (data.data) {
          response.data = instanceToPlain(data.data);
        } else {
          response.data = instanceToPlain(data);
        }
        if (data.meta) {
          response.meta = data.meta;
        }

        return response;
      }),
    );
  }
}
