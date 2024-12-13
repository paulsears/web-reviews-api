import { beforeEach, describe, expect, it } from "vitest";
import { mock, Mock } from "@aplaceformom/mockfill";
import { HealthCheckController } from "../../src/controller/health-check.controller";
import { HealthCheckService } from "../../src/service/health-check";
import { HealthResponse } from "../../src/model/health.entity";

describe("HealthCheckController", () => {
  let healthService: Mock<HealthCheckService>;
  let controller: HealthCheckController;

  beforeEach(async () => {
    healthService = mock<HealthCheckService>();
    controller = new HealthCheckController(healthService);
  });

  describe("health", () => {
    it("should return HealthCheckStatus", async () => {
      healthService.retrieveServicesStatus = async () => [];
      expect(await controller.health()).toBeInstanceOf(HealthResponse);
    });
  });
});
