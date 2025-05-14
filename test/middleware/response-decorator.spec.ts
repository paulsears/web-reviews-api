import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Request, Response as ExpressResponse } from "express";
import { vi, beforeEach, describe, expect, it } from "vitest";
import { Config } from "../../src/config/config";
import { mock, Mock } from "@aplaceformom/mockfill";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { ResponseDecorator } from "../../src/module/common/middleware/response-decorator";
import { DateTime } from "@aplaceformom/apfm-datetime";
import { of, lastValueFrom } from "rxjs";
import { ArgumentsHost, HttpArgumentsHost } from "@nestjs/common/interfaces";

interface Response<T> extends ExpressResponse {
  message: T;
  meta?: {
    build: string;
    name: string;
    version: string;
    time: number;
    timestamp: Date;
    env: string;
    error?: any;
  };
}

describe("ResponseDecorator", () => {
  describe("ResponseDecorator - intercept", () => {
    let host: Mock<HttpArgumentsHost>;
    let middleware: ResponseDecorator<any>;
    let logger: Mock<Logger>;
    let dateTime: Mock<DateTime>;
    let context: Mock<ExecutionContext>;
    let callHandler: Mock<CallHandler>;
    let config: Config;

    beforeEach(() => {
      logger = mock<Logger>();
      dateTime = mock<DateTime>();
      callHandler = mock<CallHandler>();
      context = mock<ExecutionContext>();
      host = mock<HttpArgumentsHost>();
      config = {
        port: 3000,
        appName: "test",
        appVersion: "1.0.0",
        appBuild: "test",
        appEnv: "test",
        swaggerRoute: "/api/documentation",
        apiVersion: "1.0.0",
        logger: {
          serviceName: "test",
          serviceVersion: "1.0.0",
        },
        expressLogger: {
          ignoreUrlPaths: ["/ping", "/health"],
        },
        responseDecorator: {
          ignoreUrlPaths: [],
        },
      };
      middleware = new ResponseDecorator<any>(logger, dateTime, config);
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
          env: config.appEnv,
          error: undefined,
        },
      } as Response<any>;

      host.getRequest = vi.fn().mockReturnValue({ url: "/not-an-excluded-route" });
      context.switchToHttp = (): HttpArgumentsHost => host;

      callHandler.handle = vi.fn(() => of(data)); // Simulate next.handle() returning observable

      const result = await lastValueFrom(middleware.intercept(context, callHandler));
      expect(result).toEqual(expectedResult);
    });

    it("should ignore the excluded route", async () => {
      config = {
        ...config,
        responseDecorator: {
          ignoreUrlPaths: ["/excluded"],
        },
      };
      middleware = new ResponseDecorator<any>(logger, dateTime, config);

      const data = { message: "Success" };
      const expectedResult: Response<any> = {
        ...data,
      } as Response<any>;

      host.getRequest = vi.fn().mockReturnValue({ url: "/excluded" });
      context.switchToHttp = (): HttpArgumentsHost => host;

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
          env: config.appEnv,
          error: undefined,
        },
      } as Response<any>;

      host.getRequest = vi.fn().mockReturnValue({ url: "/not-an-excluded-route" });
      context.switchToHttp = (): HttpArgumentsHost => host;
      callHandler.handle = vi.fn(() => of(data));

      const result = await lastValueFrom(middleware.intercept(context, callHandler));
      expect(result).toEqual(expectedResult);
    });

    describe("catch", () => {
      let response: Response<any>;
      let error: Error;
      let host: ArgumentsHost;
      let request: Request;

      beforeEach(() => {
        logger = mock<Logger>();
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
    });
  });
});
