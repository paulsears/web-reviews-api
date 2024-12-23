import { Module } from "@nestjs/common";
import { StatusModule } from "./status";
import { LoggerModule } from "./logger";
import { AppConfigModule } from "./app-config";

@Module({
  imports: [AppConfigModule, LoggerModule, StatusModule],
  controllers: [],
  providers: [],
  exports: [AppConfigModule, LoggerModule],
})
export class AppModule {}
