import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, ArrayMinSize } from "class-validator";
import { Transform } from "class-transformer";

export class GetReviewsQueryDto {
  @ApiProperty({
    description: "Array of provider IDs to filter reviews by",
    type: [Number],
    required: false,
    example: [924, 1234],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: "At least one provider ID must be provided if providerIds is specified" })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      // Handle comma-separated values
      if (value.includes(",")) {
        return value.split(",").map((v) => parseInt(v.trim(), 10));
      }
      return [parseInt(value, 10)];
    }
    if (Array.isArray(value)) {
      return value.map((v) => parseInt(v.toString(), 10));
    }
    return value;
  })
  public providerIds?: number[];

  @ApiProperty({
    description: "Array of APFM Property IDs (YGL IDs) to filter reviews by",
    type: [Number],
    required: false,
    example: [123203, 5678],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1, { message: "At least one APFM Property ID must be provided if apfmPropertyIds is specified" })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      // Handle comma-separated values
      if (value.includes(",")) {
        return value.split(",").map((v) => parseInt(v.trim(), 10));
      }
      return [parseInt(value, 10)];
    }
    if (Array.isArray(value)) {
      return value.map((v) => parseInt(v.toString(), 10));
    }
    return value;
  })
  public apfmPropertyIds?: number[];
}
