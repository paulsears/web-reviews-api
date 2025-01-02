import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { mock, Mock, verify } from "@aplaceformom/mockfill";
import { beforeEach, describe, expect, it } from "vitest";
import { HealthStatuses } from "../../../../src/module/status/model/health";
import { HealthResponse } from "../../../../src/module/status/model/health.entity";
import { HealthCheckController } from "../../../../src/module/status/controller/health-check.controller";
import { HealthCheckStatus } from "../../../../src/module/status/model/health-check-status.entity";
import { HealthCheckService } from "../../../../src/module/status/service/health-check";

describe("HealthCheckController", () => {
  let logger: Mock<Logger>;
  let healthService: Mock<HealthCheckService>;
  let controller: HealthCheckController;

  beforeEach(async () => {
    logger = mock<Logger>();
    healthService = mock<HealthCheckService>();
    controller = new HealthCheckController(logger, healthService);
  });

  describe("health", () => {
    it("should return HealthCheckStatus", async () => {
      healthService.retrieveServicesStatus = async () => [];
      expect(await controller.health()).toBeInstanceOf(HealthResponse);
    });

    it("logs an error if a service is not healthy", async () => {
      healthService.retrieveServicesStatus = async () => [
        new HealthCheckStatus("foo", HealthStatuses.ERROR, true, "I'm an error"),
      ];
      await controller.health();
      verify(logger.error).calledOnce();
    });
  });
});
