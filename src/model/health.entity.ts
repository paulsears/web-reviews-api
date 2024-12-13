import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { HealthCheckStatus } from "./health-check-status.entity";
import { Response } from "./response.entity";

@ApiExtraModels(Response)
@ApiExtraModels(HealthCheckStatus)
export class HealthResponse extends Response<HealthCheckStatus[]> {
  @ApiProperty({
    type: [HealthCheckStatus],
  })
  public data: HealthCheckStatus[];

  public constructor(data: HealthCheckStatus[]) {
    super();
    this.data = data;
  }
}
