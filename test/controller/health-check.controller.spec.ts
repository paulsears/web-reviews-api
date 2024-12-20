import { beforeEach, describe, expect, it } from "vitest";
import { mock, Mock, verify } from "@aplaceformom/mockfill";
import { HealthCheckController } from "../../src/controller/health-check.controller";
import { HealthCheckService } from "../../src/service/health-check";
import { HealthResponse } from "../../src/model/health.entity";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { HealthCheckStatus } from "../../src/model/health-check-status.entity";
import { HealthStatuses } from "../../src/model/health";

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
