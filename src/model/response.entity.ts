import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Metadata } from "./metadata.entity";

@ApiExtraModels(Metadata)
export class Response<T> {
  public meta: Metadata = new Metadata();

  @ApiProperty()
  public data: T | null;

  public constructor(data: T | null = null) {
    this.data = data;
  }
}
