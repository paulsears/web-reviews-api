import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { mock, Mock } from "@aplaceformom/mockfill";
import { beforeEach, describe, expect, it } from "vitest";
import { HealthCheckStatus } from "../../../../src/module/status/model/health-check-status.entity";
import { HealthCheckService } from "../../../../src/module/status/service/health-check";

describe("HealthCheckService", () => {
  let logger: Mock<Logger>;
  let service: HealthCheckService;

  beforeEach(() => {
    logger = mock<Logger>();
    service = new HealthCheckService(logger);
  });

  describe("retrieveServicesStatus", () => {
    it("should return an empty array", async () => {
      const statuses = await service.retrieveServicesStatus();
      expect(statuses[0]).toBeInstanceOf(HealthCheckStatus);
    });
  });

  describe("health check entity", () => {
    it("should return a of the message", () => {
      const healthCheckStatus = new HealthCheckStatus("test", "OK", false);
      expect(healthCheckStatus.toString()).toBe(
        "HealthCheckStatus: { name: test, status: OK, critical: false, message: undefined }",
      );
    });

    it("Return the error message", () => {
      const healthCheckStatus = new HealthCheckStatus("test", "ERROR", true);
      healthCheckStatus.maybeSetErrorMessage(["Test Error message"]);
      expect(healthCheckStatus.errorMessage).toBe("Errors: Test Error message");
      expect(healthCheckStatus.responseStatus).toBe("ERROR");
      expect(healthCheckStatus.isCritical).toBe(true);
    });
  });
});
