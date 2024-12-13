import { beforeAll, describe, expect, it } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { PingController } from "../../src/controller/ping.controller";
import { BasicResponse } from "../../src/model/basic-response.entity";

describe("PingController", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PingController],
    }).compile();
  });

  describe("ping", () => {
    it("should return PingResponse", () => {
      const ping = app.get<PingController>(PingController);
      expect(ping.ping()).toBeInstanceOf(BasicResponse);
    });
  });
});
