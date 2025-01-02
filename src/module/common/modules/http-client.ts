import { getApfmHttpClientModule, HttpClient } from "@aplaceformom/apfm-http-client";
import { Global, Module } from "@nestjs/common";

const ApfmHttpClientModule = getApfmHttpClientModule();

@Global()
@Module({
  imports: [ApfmHttpClientModule.forRoot()],
  providers: [HttpClient],
  exports: [HttpClient],
})
export class HttpClientModule {}
