import { BadRequestException } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { beforeEach, describe, expect, it } from "vitest";
import { ExampleValidationPipe } from "../../src/validator/example-validation-pipe";
import { expectToThrow } from "../testing-utils/expect-to-throw";

describe("BasicPostValidationPipe", () => {
  let pipe: ExampleValidationPipe;

  class CreateTestDto {
    @IsString()
    public name: string;

    @IsString()
    @IsOptional()
    public optional?: string;
  }

  beforeEach(() => {
    pipe = new ExampleValidationPipe();
  });

  describe("transform", () => {
    it("returns the provided value if metatype is not provided", async () => {
      const value = "foo";
      const result = await pipe.transform(value, { type: "body" });

      expect(result).toEqual(value);
    });

    it("returns the provided value if metatype is a primitive type", async () => {
      const value = "foo";
      const result = await pipe.transform(value, { type: "body", metatype: String });

      expect(result).toEqual(value);
    });

    it("throws a BadRequestException if the provided value does not validate against the provided type", async () => {
      const error = await expectToThrow<BadRequestException>(
        pipe.transform({}, { type: "body", metatype: CreateTestDto }),
        "Validation failed",
      );
      expect(error.getStatus()).toEqual(400);
    });

    it("returns the value if it validates against the provided type", async () => {
      const value = {
        name: "foo",
      };
      const result = await pipe.transform(value, { type: "body", metatype: CreateTestDto });

      expect(result).toEqual(value);
    });
  });
});
