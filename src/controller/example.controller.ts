import { Controller, Get } from "@nestjs/common";
import { ExampleHttpClientUsage } from "../service/example-http-client-usage";
import { BasicResponse } from "../model/basic-response.entity";

@Controller("example")
export class ExampleController {
  public constructor(private service: ExampleHttpClientUsage) {}

  @Get()
  public async example(): Promise<BasicResponse> {
    await this.service.exampleUsage();
    return new BasicResponse();
  }
}
