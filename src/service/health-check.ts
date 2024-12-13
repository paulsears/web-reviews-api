import { Injectable } from "@nestjs/common";
import { HealthCheckStatus } from "../model/health-check-status.entity";

@Injectable()
export class HealthCheckService {
  public constructor() {}

  // TODO: Eventually, everything that this application depends on, external to itself,
  // will be represented here. However, the concept of an "external service" in the
  // health check will require several other Injectable dependencies, and will be a
  // follow-on effort. For now, we use this place holder that returns an empty array.
  public async retrieveServicesStatus(): Promise<HealthCheckStatus[]> {
    const statuses: HealthCheckStatus[] = await Promise.all([]);

    return statuses;
  }
}
