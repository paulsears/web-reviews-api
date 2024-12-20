import { Injectable } from "@nestjs/common";
import { HealthCheckStatus } from "../model/health-check-status.entity";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { HealthStatuses } from "../model/health";

@Injectable()
export class HealthCheckService {
  public constructor(private logger: Logger) {}

  // TODO: Eventually, everything that this application depends on, external to itself,
  // will be represented here. However, the concept of an "external service" in the
  // health check will require several other Injectable dependencies, and will be a
  // follow-on effort. For now, we use this place holder as an example.
  public async retrieveServicesStatus(): Promise<HealthCheckStatus[]> {
    const statuses: HealthCheckStatus[] = await Promise.all([
      Promise.resolve(new HealthCheckStatus("placeholder", HealthStatuses.OK, false)).catch((err) =>
        this.handleError("placeholder", false, err),
      ),
    ]);

    return statuses;
  }

  private handleError(serviceName: string, critical: boolean, err: Error): HealthCheckStatus {
    this.logger.error(`Error retrieving health check information from ${serviceName}`, err);
    return new HealthCheckStatus(serviceName, HealthStatuses.UNKNOWN, critical, "Unable to determine status");
  }
}
