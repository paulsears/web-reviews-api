import { ApfmLoggerConfigOptions, ExpressMiddlewareOptions } from "@aplaceformom/apfm-logger-typescript";
import { DEFAULT_STRING_VALUE } from "./constants";

const DEFAULT_APPLICATION_PORT = 3000;

// The following block accommodates using `||` to read in ENV vars that we want to make sure fall through
// if a Falsy value is provided. Add any additional ENV vars with fallbacks to defaults in this section.
// ALL other code should be outside the `NOSONAR` exclusion
//NOSONAR_BEGIN
const APP_NAME = process.env.APP_NAME || process.env.SERVICE_NAME || "NestJS-Template-App";
const APP_VERSION = process.env.APP_VERSION || process.env.SERVICE_VERSION || DEFAULT_STRING_VALUE;
const APP_BUILD = process.env.APP_BUILD || DEFAULT_STRING_VALUE;
const APPLICATION_PORT = parseInt(process.env.PORT as string, 10) || DEFAULT_APPLICATION_PORT;
//NOSONAR_END

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
  port: APPLICATION_PORT,
  appName: APP_NAME,
  appVersion: APP_VERSION,
  appBuild: APP_BUILD,
  swaggerRoute: "/api/documentation",
  apiVersion: "1.0.0",
  logger: {
    serviceName: APP_NAME,
    serviceVersion: APP_VERSION,
  },
  expressLogger: {
    ignoreUrlPaths: ["/ping", "/health"],
  },
};
