import { DateTime, getApfmDateTimeNestJsModule } from "@aplaceformom/apfm-datetime";
import { Global, Module } from "@nestjs/common";

const ApfmDateTimeNestJsModule = getApfmDateTimeNestJsModule();

@Global()
@Module({
  imports: [ApfmDateTimeNestJsModule.forRoot()],
  providers: [DateTime],
  exports: [DateTime],
})
export class DateTimeModule {}
