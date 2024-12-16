import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BasicResponse } from "../model/basic-response.entity";
import { Response } from "../model/response.entity";
import { DateTime } from "../service/date-time";
import { Config } from "../config/config";
import { applicationConfig } from "../config";

@Catch()
@Injectable()
export class ResponseDecorator<T> implements NestInterceptor<T, Response<T>>, ExceptionFilter {
  public constructor(
    private dateTime: DateTime,
    private config: Config = applicationConfig,
  ) {}

  public intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestStartTime = this.dateTime.getDate();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const requestEndTime = this.dateTime.getDate();
          const requestTotalTime = requestEndTime.getTime() - requestStartTime.getTime();
          return this.assignMetadata(data, requestStartTime, requestTotalTime);
        },
      }),
    );
  }

  public catch(error: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    res.status(status);

    const data = new BasicResponse();
    this.assignMetadata(data, this.dateTime.getDate(), undefined, error);

    return res.status(status).json(data);
  }

  private assignMetadata(data: any, start: Date, time?: number, error?: Error) {
    data.meta.build = this.config.appBuild;
    data.meta.name = this.config.appName;
    data.meta.version = this.config.appVersion;
    data.meta.time = time || -1;
    data.meta.timestamp = start;

    data.meta.error = error?.message;

    return data;
  }
}
