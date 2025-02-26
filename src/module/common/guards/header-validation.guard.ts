import { CanActivate, ExecutionContext, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class HeaderValidationGuard implements CanActivate {
  private readonly requiredHeaders: string[];

  public constructor(requiredHeaders: string[]) {
    this.requiredHeaders = requiredHeaders;
  }

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers && this.requiredHeaders.length > 0) {
      throw new BadRequestException("Missing headers");
    }

    for (const header of this.requiredHeaders) {
      if (!request.headers[header.toLowerCase()]) {
        throw new BadRequestException(`Missing required header: ${header}`);
      }
    }

    return true;
  }
}
