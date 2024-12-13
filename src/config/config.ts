import { DEFAULT_STRING_VALUE } from "./constants";

const DEFAULT_APPLICATION_PORT = 3000;
const APPLICATION_PORT = process.env.PORT || DEFAULT_APPLICATION_PORT.toString();

export interface Config {
  port: number;
  appName: string;
  appVersion: string;
  appBuild: string;
  swaggerRoute: string;
  apiVersion: string;
}

export const config: Config = {
  port: parseInt(APPLICATION_PORT, 10) || DEFAULT_APPLICATION_PORT,
  appName: process.env.APP_NAME || "NestJS App",
  appVersion: process.env.APP_VERSION || DEFAULT_STRING_VALUE,
  appBuild: process.env.APP_BUILD || DEFAULT_STRING_VALUE,
  swaggerRoute: "/api/documentation",
  apiVersion: "1.0.0",
};
