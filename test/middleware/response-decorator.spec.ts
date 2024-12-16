import { ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it } from "vitest";
import { config } from "../../src/config/config";
import { ResponseDecorator } from "../../src/middleware/response-decorator";
import { DateTime } from "../../src/service/date-time";

describe("ResponseDecorator", () => {
  let middleware: ResponseDecorator<any>;
  let dateTime: DateTime;
  let request: Request;
  let response: Response;
  let error: Error;
  let host: ArgumentsHost;

  beforeEach(() => {
    dateTime = new DateTime();
    middleware = new ResponseDecorator<any>(dateTime, config);

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
      error = new HttpException("foo", 200);
      response = {
        status: () => {
          return {
            json: () => 200,
          };
        },
      } as any;

      const statusCode = middleware.catch(error, host);
      expect(statusCode).toEqual(200);
    });
  });
});
