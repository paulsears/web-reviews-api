import { Module } from "@nestjs/common";
import { AppConfigModule } from "./common/modules/app-config";
import { DateTimeModule } from "./common/modules/date-time";
import { HttpClientModule } from "./common/modules/http-client";
import { LoggerModule } from "./common/modules/logger";
import { ExampleModule } from "./example/module";
import { ReviewsModule } from "./reviews/module";
import { StatusModule } from "./status/module";

@Module({
  imports: [
    AppConfigModule,
    DateTimeModule,
    ExampleModule,
    HttpClientModule,
    LoggerModule,
    ReviewsModule,
    StatusModule,
  ],
  controllers: [],
  providers: [],
  exports: [AppConfigModule, DateTimeModule, HttpClientModule, LoggerModule],
})
export class AppModule {}
