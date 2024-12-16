import { beforeEach, describe, expect, it } from "vitest";
import { DateTime } from "../../src/service/date-time";

describe("date-time", () => {
  describe("DateTime class", () => {
    let date: DateTime;

    beforeEach(() => {
      date = new DateTime();
    });

    describe("dateNowInSeconds", () => {
      it("returns a timestamp", () => {
        const result = date.dateNowInSeconds();
        expect(parseFloat(result.toString())).toEqual(parseInt(result.toString(), 10));
      });
    });
  });
});
