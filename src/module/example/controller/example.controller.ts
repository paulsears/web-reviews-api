import { Controller, Get, UseGuards } from "@nestjs/common";
import { ExampleHttpClientUsage } from "../service/example-http-client-usage";
import { BasicResponse } from "../../common/model/basic-response.entity";
import { HeaderValidationGuard } from "../../common/guards/header-validation.guard";

@Controller("example")
export class ExampleController {
  public constructor(private readonly service: ExampleHttpClientUsage) {}

  @Get()
  public async example(): Promise<BasicResponse> {
    await this.service.exampleUsage();
    return new BasicResponse();
  }

  @Get("headerError")
  @UseGuards(new HeaderValidationGuard(["must-pass-header"]))
  public async headerError(): Promise<BasicResponse> {
    await this.service.exampleUsage();
    return new BasicResponse();
  }
}
