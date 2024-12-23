import { beforeAll, describe, expect, it } from "vitest";
import { PingController } from "../../src/controller/ping.controller";
import { BasicResponse } from "../../src/model/basic-response.entity";
import { mock, Mock } from "@aplaceformom/mockfill";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { Config } from "../../src/config/config";

describe("PingController", () => {
  let logger: Mock<Logger>;
  let controller: PingController;

  beforeAll(async () => {
    logger = mock<Logger>();
    controller = new PingController(logger, { port: 3000 } as unknown as Config);
  });

  describe("ping", () => {
    it("should return PingResponse", () => {
      expect(controller.ping()).toBeInstanceOf(BasicResponse);
    });
  });
});
