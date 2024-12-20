import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { STATUS_MESSAGE_INTERNAL_SERVER_ERROR } from "../config/constants";
import { HealthResponse } from "../model/health.entity";
import { HealthCheckService } from "../service/health-check";
import { Logger } from "@aplaceformom/apfm-logger-typescript";

@ApiTags("status")
@Controller("health")
export class HealthCheckController {
  public constructor(
    private logger: Logger,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: HealthResponse, description: "Deep health endpoint" })
  @ApiResponse({ status: 500, type: HealthResponse, description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR })
  public async health(): Promise<HealthResponse> {
    const healthCheck = await this.healthCheckService.retrieveServicesStatus();

    for (const service of healthCheck) {
      if (!service.isOk()) {
        this.logger.error(`Service ${service.serviceName} is not healthy`);
      }
    }

    return new HealthResponse(healthCheck);
  }
}
