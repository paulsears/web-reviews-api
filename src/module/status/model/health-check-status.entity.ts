import { isDefined } from "nullable-ts";
import { HealthStatuses } from "./health";

export class HealthCheckStatus {
  public constructor(
    private readonly name: string,
    private readonly status: string | HealthStatuses,
    private readonly critical: boolean,
    private message?: string,
  ) {
    switch (status.toUpperCase()) {
      case "OK":
        this.status = HealthStatuses.OK;
        break;
      case "ERROR":
        this.status = HealthStatuses.ERROR;
        break;
      default:
        this.status = HealthStatuses.UNKNOWN;
    }
  }

  public get serviceName(): string {
    return this.name;
  }

  public get responseStatus(): string | HealthStatuses {
    return this.status;
  }

  public get isCritical(): boolean {
    return this.critical;
  }

  public get errorMessage(): string | undefined {
    return this.message;
  }

  public isOk(): boolean {
    return this.status === HealthStatuses.OK;
  }

  public maybeSetErrorMessage(errors: Array<string | undefined>): void {
    if (this.isOk()) {
      return;
    }
    this.message = `Errors: ${errors.filter(isDefined).join("; ")}`;
  }

  public toString(): string {
    return `HealthCheckStatus: { name: ${this.name}, status: ${this.status}, critical: ${this.critical}, message: ${this.message} }`;
  }
}
