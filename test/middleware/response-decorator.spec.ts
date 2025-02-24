import { ArgumentsHost, CallHandler, ExecutionContext, HttpException } from "@nestjs/common";
import { Request, Response as ExpressResponse } from "express";
import { vi, beforeEach, describe, expect, it } from "vitest";
import { config } from "../../src/config/config";
import { mock, Mock, verify } from "@aplaceformom/mockfill";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { ResponseDecorator } from "../../src/module/common/middleware/response-decorator";
import { DateTime } from "@aplaceformom/apfm-datetime";
import { of, lastValueFrom } from "rxjs";

interface Response<T> extends ExpressResponse {
  message: T;
  meta?: {
    build: string;
    name: string;
    version: string;
    time: number;
    timestamp: Date;
    error?: any;
  };
}

describe("ResponseDecorator", () => {
  let middleware: ResponseDecorator<any>;
  let logger: Mock<Logger>;
  let dateTime: DateTime;
  let request: Request;
  let response: Response<any>;
  let error: Error;
  let host: ArgumentsHost;

  beforeEach(() => {
    logger = mock<Logger>();
    dateTime = new DateTime();
    middleware = new ResponseDecorator<any>(logger, dateTime, config);

    host = {
      switchToHttp: () => {
        return {
          getRequest: (): Request => request,
          getResponse: (): Response<any> => response,
        };
      },
    } as ArgumentsHost;
  });

  describe("ResponseDecorator - intercept", () => {
    let middleware: ResponseDecorator<any>;
    let logger: Mock<Logger>;
    let dateTime: Mock<DateTime>;
    let context: ExecutionContext;
    let callHandler: Mock<CallHandler>;

    beforeEach(() => {
      logger = mock<Logger>();
      dateTime = mock<DateTime>();
      callHandler = mock<CallHandler>();
      middleware = new ResponseDecorator<any>(logger, dateTime, config);

      context = {} as ExecutionContext;

      // Mock the DateTime getDate method
      dateTime.getDate = vi.fn(() => new Date(2023, 0, 1, 12, 0, 0));
    });

    it("should apply metadata to the response", async () => {
      const data = { message: "Success" };
      const expectedResult: Response<any> = {
        ...data,
        meta: {
          build: config.appBuild,
          name: config.appName,
          version: config.appVersion,
          time: 0,
          timestamp: dateTime.getDate(),
          error: undefined,
        },
      } as Response<any>;

      callHandler.handle = vi.fn(() => of(data)); // Simulate next.handle() returning observable

      const result = await lastValueFrom(middleware.intercept(context, callHandler));
      expect(result).toEqual(expectedResult);
    });

    it("should measure the time taken for the request", async () => {
      const data = { message: "Success" };
      const startDate = new Date(2023, 0, 1, 12, 0, 0);
      const endDate = new Date(2023, 0, 1, 12, 0, 1);

      dateTime.getDate = vi.fn().mockReturnValueOnce(startDate).mockReturnValueOnce(endDate);

      const expectedResult: Response<any> = {
        ...data,
        meta: {
          build: config.appBuild,
          name: config.appName,
          version: config.appVersion,
          time: 1000,
          timestamp: startDate,
          error: undefined,
        },
      } as Response<any>;

      callHandler.handle = vi.fn(() => of(data));

      const result = await lastValueFrom(middleware.intercept(context, callHandler));
      expect(result).toEqual(expectedResult);
    });
  });

  describe("catch", () => {
    it("should not return a status code for basic Error objects", () => {
      error = new Error();
      response = {
        status: (): unknown => {
          return {
            json: () => undefined,
          };
        },
      } as any;

      const statusCode = middleware.catch(error, host);
      expect(statusCode).toEqual(undefined);
    });

    it("should return a status code for known HttpException types", () => {
      error = new HttpException("foo", 500);
      response = {
        status: (): unknown => {
          return {
            json: () => 500,
          };
        },
      } as any;

      const statusCode = middleware.catch(error, host);
      expect(statusCode).toEqual(500);
      verify(logger.debug).calledOnce();
    });
  });
});
