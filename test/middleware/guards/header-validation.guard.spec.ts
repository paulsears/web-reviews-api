import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { HeaderValidationGuard } from "../../../src/module/common/guards/header-validation.guard";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

describe("HeaderValidationGuard", () => {
  let guard: HeaderValidationGuard;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    guard = new HeaderValidationGuard(["x-user-logged-id", "x-request-id"]);

    // Mock ExecutionContext to simulate incoming request
    mockContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn(),
      }),
    } as unknown as ExecutionContext;
  });

  it("should allow the request if all required headers are present", () => {
    const mockRequest = { headers: { "x-user-logged-id": "user123", "x-request-id": "req-456" } };
    (mockContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it("should throw BadRequestException if a required header is missing", () => {
    const mockRequest = { headers: { "x-user-logged-id": "user123" } }; // Missing "x-request-id"
    (mockContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if all required headers are missing", () => {
    const mockRequest = { headers: {} }; // No headers at all
    (mockContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
  });

  it("should throw BadRequestException if headers are undefined", () => {
    const mockRequest = {}; // No headers key
    (mockContext.switchToHttp().getRequest as Mock).mockReturnValue(mockRequest);

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
  });
});
