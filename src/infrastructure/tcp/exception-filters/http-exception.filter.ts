import { Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Observable, throwError } from "rxjs";

import { StatusCode } from "@/infrastructure/tcp/mappers";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  public catch(exception: HttpException): Observable<unknown> {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const status = StatusCode.toString(statusCode);
    const timestamp = new Date().toISOString();
    const data = response;

    return throwError(() => ({ status, data, timestamp }));
  }
}
