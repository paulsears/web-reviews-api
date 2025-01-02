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
});
