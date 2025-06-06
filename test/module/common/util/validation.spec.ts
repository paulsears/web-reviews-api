import { describe, expect, it } from "vitest";
import { validationErrorsToString } from "../../../../src/module/common/util/validation";

describe("validationErrorsToStringArray", () => {
  it("should return an empty string for no errors", () => {
    const result = validationErrorsToString([]);
    expect(result).toEqual("");
  });

  it("should concat constraints in the error message", () => {
    const result = validationErrorsToString([
      {
        target: {},
        value: "test",
        property: "testProperty",
        children: [],
        constraints: {
          isNotEmpty: "testProperty should not be empty",
          isString: "testProperty must be a string",
        },
      },
    ]);
    expect(result).toEqual("testProperty should not be empty; testProperty must be a string");
  });

  it("should concat constraints and children in the error message", () => {
    const result = validationErrorsToString([
      {
        target: {},
        value: "test",
        property: "testProperty",
        children: [
          {
            target: {},
            value: "childTest",
            property: "childProperty",
            children: [],
            constraints: {
              isNotEmpty: "childProperty should not be empty",
            },
          },
        ],
        constraints: {
          isNotEmpty: "testProperty should not be empty",
          isString: "testProperty must be a string",
        },
      },
    ]);
    expect(result).toEqual(
      "testProperty should not be empty; testProperty must be a string; childProperty should not be empty",
    );
  });

  it("should return empty string if there are no constraints", () => {
    const result = validationErrorsToString([
      {
        target: {},
        value: "test",
        property: "testProperty",
        children: [],
        constraints: undefined,
      },
    ]);
    expect(result).toEqual("");
  });
});
