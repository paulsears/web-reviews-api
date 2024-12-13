import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { STATUS_MESSAGE_INTERNAL_SERVER_ERROR } from "../config/constants";
import { HealthResponse } from "../model/health.entity";
import { HealthCheckService } from "../service/health-check";

@ApiTags("status")
@Controller("health")
export class HealthCheckController {
  public constructor(private healthCheckService: HealthCheckService) {}

  @Get()
  @ApiResponse({ status: 200, type: HealthResponse, description: "Deep health endpoint" })
  @ApiResponse({ status: 500, type: HealthResponse, description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR })
  public async health(): Promise<HealthResponse> {
    const healthCheck = await this.healthCheckService.retrieveServicesStatus();

    for (const service of healthCheck) {
      if (!service.isOk()) {
        // TODO: Update this to common logger
        // no-op
      }
    }

    return new HealthResponse(healthCheck);
  }
}
