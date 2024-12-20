import { ApfmLoggerConfigOptions, ExpressMiddlewareOptions } from "@aplaceformom/apfm-logger-typescript";
import { DEFAULT_STRING_VALUE } from "./constants";

const APP_NAME = process.env.APP_NAME || "NestJS-Template-App";
const DEFAULT_APPLICATION_PORT = 3000;
const APPLICATION_PORT = process.env.PORT || DEFAULT_APPLICATION_PORT.toString();

export interface Config {
  port: number;
  appName: string;
  appVersion: string;
  appBuild: string;
  swaggerRoute: string;
  apiVersion: string;
  logger: ApfmLoggerConfigOptions;
  expressLogger: ExpressMiddlewareOptions;
}

export const config: Config = {
  port: parseInt(APPLICATION_PORT, 10) || DEFAULT_APPLICATION_PORT,
  appName: APP_NAME,
  appVersion: process.env.APP_VERSION || DEFAULT_STRING_VALUE,
  appBuild: process.env.APP_BUILD || DEFAULT_STRING_VALUE,
  swaggerRoute: "/api/documentation",
  apiVersion: "1.0.0",
  logger: {
    serviceName: APP_NAME,
    serviceVersion: process.env.APP_VERSION || DEFAULT_STRING_VALUE,
  },
  expressLogger: {
    ignoreUrlPaths: ["/health", "/ping"],
  },
};
