import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";
import { Observable, map } from "rxjs";

import { Response } from "@/infrastructure/tcp/interfaces";
import { StatusCode } from "@/infrastructure/tcp/mappers";

@Injectable()
export class RpcResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const handler = context.getHandler();
    const statusCodeMetadata = Reflect.getMetadata(
      HTTP_CODE_METADATA,
      handler,
    ) as number | undefined;
    const statusCode: number =
      statusCodeMetadata === undefined ? HttpStatus.OK : statusCodeMetadata;
    return next.handle().pipe(
      map((data?: T) => ({
        status: StatusCode.toString(statusCode),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
