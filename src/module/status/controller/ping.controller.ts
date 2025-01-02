import { Controller, Get, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BasicResponse } from "../../common/model/basic-response.entity";
import { STATUS_MESSAGE_INTERNAL_SERVER_ERROR } from "../../../config/constants";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { Config } from "../../../config/config";

@ApiTags("status")
@Controller("ping")
export class PingController {
  public constructor(
    private logger: Logger,
    @Inject("APP_CONFIG") private readonly config: Config,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: BasicResponse, description: "Ping" })
  @ApiResponse({ status: 500, type: BasicResponse, description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR })
  public ping(): BasicResponse {
    this.logger.debug(`Ping received on port: ${this.config.port}`);
    return new BasicResponse();
  }
}
