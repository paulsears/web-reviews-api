import { Injectable } from "@nestjs/common";

@Injectable()
export class DateTime {
  public dateNowInSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  public getDate(): Date {
    return new Date();
  }
}
