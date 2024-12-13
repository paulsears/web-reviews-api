import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module/application";
import * as compression from "compression";
import { applicationConfig } from "./config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

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
  const app = await NestFactory.create(AppModule);

  const config = applicationConfig;

  setupSwagger(app);
  app.use(compression());
  app.enableShutdownHooks();

  await app.listen(config.port);
}

bootstrap().catch((e) => console.error("Unable to start server", e)); // eslint-disable-line
