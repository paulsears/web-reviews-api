import { ApfmNestJsLogModule, Logger } from "@aplaceformom/apfm-logger-typescript";
import { Global, Module } from "@nestjs/common";
import { applicationConfig } from "../config";

@Global()
@Module({
  imports: [ApfmNestJsLogModule.forRoot(applicationConfig.logger)],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
