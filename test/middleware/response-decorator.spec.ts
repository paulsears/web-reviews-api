import { ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it } from "vitest";
import { config } from "../../src/config/config";
import { ResponseDecorator } from "../../src/middleware/response-decorator";
import { DateTime } from "../../src/service/date-time";
import { mock, Mock, verify } from "@aplaceformom/mockfill";
import { Logger } from "@aplaceformom/apfm-logger-typescript";

describe("ResponseDecorator", () => {
  let middleware: ResponseDecorator<any>;
  let logger: Mock<Logger>;
  let dateTime: DateTime;
  let request: Request;
  let response: Response;
  let error: Error;
  let host: ArgumentsHost;

  beforeEach(() => {
    logger = mock<Logger>();
    dateTime = new DateTime();
    middleware = new ResponseDecorator<any>(logger, dateTime, config);

    host = {
      switchToHttp: () => {
        return {
          getRequest: () => request,
          getResponse: () => response,
        };
      },
    } as ArgumentsHost;
  });

  describe("catch", () => {
    it("should not return a status code for basic Error objects", () => {
      error = new Error();
      response = {
        status: () => {
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
        status: () => {
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
