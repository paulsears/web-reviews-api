import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BasicResponse } from "../model/basic-response.entity";
import { STATUS_MESSAGE_INTERNAL_SERVER_ERROR } from "../config/constants";

@ApiTags("status")
@Controller("ping")
export class PingController {
  public constructor() {}

  @Get()
  @ApiResponse({ status: 200, type: BasicResponse, description: "Ping" })
  @ApiResponse({ status: 500, type: BasicResponse, description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR })
  public ping(): BasicResponse {
    return new BasicResponse();
  }
}
