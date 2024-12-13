import { beforeEach, describe, expect, it } from "vitest";
import { HealthCheckService } from "../../src/service/health-check";

describe("HealthCheckService", () => {
  let service: HealthCheckService;

  beforeEach(() => {
    service = new HealthCheckService();
  });

  describe("retrieveServicesStatus", () => {
    it("should return an empty array", async () => {
      const statuses = await service.retrieveServicesStatus();
      expect(statuses).toEqual([]);
    });
  });
});
