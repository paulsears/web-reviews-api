import { Module } from "@nestjs/common";
import { StatusModule } from "./status";
import { LoggerModule } from "./logger";
import { AppConfigModule } from "./app-config";
import { HttpClientModule } from "./http-client";
import { ExampleModule } from "./example";

@Module({
  imports: [AppConfigModule, ExampleModule, HttpClientModule, LoggerModule, StatusModule],
  controllers: [],
  providers: [],
  exports: [AppConfigModule, HttpClientModule, LoggerModule],
})
export class AppModule {}
