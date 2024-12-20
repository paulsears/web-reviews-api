import { Module } from "@nestjs/common";
import { StatusModule } from "./status";
import { LoggerModule } from "./logger";

@Module({
  imports: [LoggerModule, StatusModule],
  controllers: [],
  providers: [],
  exports: [LoggerModule],
})
export class AppModule {}
