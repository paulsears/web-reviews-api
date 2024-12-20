import { beforeEach, describe, expect, it } from "vitest";
import { HealthCheckService } from "../../src/service/health-check";
import { mock, Mock } from "@aplaceformom/mockfill";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { HealthCheckStatus } from "../../src/model/health-check-status.entity";

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
