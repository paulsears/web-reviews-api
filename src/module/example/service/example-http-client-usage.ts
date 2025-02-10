import { HttpClient } from "@aplaceformom/apfm-http-client";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ExampleHttpClientUsage {
  public constructor(
    private readonly logger: Logger,
    private readonly http: HttpClient,
  ) {}

  public async exampleUsage(): Promise<void> {
    const response = await this.http.get("https://httpbin.org/get");
    this.logger.info(`Response status code: ${response.status}`);
  }
}
