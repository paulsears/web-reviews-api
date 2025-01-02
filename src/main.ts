import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/application";
import * as compression from "compression";
import { applicationConfig } from "./config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { expressLogger, Logger } from "@aplaceformom/apfm-logger-typescript";
import { DateTime } from "@aplaceformom/apfm-datetime";
import { ResponseDecorator } from "./module/common/middleware/response-decorator";

const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(`${applicationConfig.appName} API Documentation`)
    .setDescription("")
    .setVersion("1.0.0")
    .addTag("api")
    .addTag("status")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(applicationConfig.swaggerRoute, app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "debug", "log"],
  });

  const config = applicationConfig;
  const logger = new Logger(applicationConfig.logger);
  app.use(expressLogger(logger, applicationConfig.expressLogger));
  app.useLogger(logger);

  const responseDecorator = new ResponseDecorator(logger, new DateTime(), applicationConfig);

  setupSwagger(app);
  app.useGlobalInterceptors(responseDecorator);
  app.use(compression());
  app.enableShutdownHooks();

  await app.listen(config.port);
}

bootstrap().catch((e) => console.error("Unable to start server", e)); // eslint-disable-line
