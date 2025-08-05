import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response as ExpressResponse } from 'express';

export interface Response<T> {
  data: T;
  message?: string;
  timestamp: string;
  path: string;
  statusCode: number;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((data: T) => ({
        data,
        message: response.getHeader('message')?.toString() || 'Success',
        timestamp: new Date().toISOString(),
        path: request.url,
        statusCode: response.statusCode,
      })),
    );
  }
}
