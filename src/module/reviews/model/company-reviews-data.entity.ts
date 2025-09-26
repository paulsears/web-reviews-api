import { ApiProperty } from "@nestjs/swagger";
import { Review } from "./review.entity";
import { AgencySemanticLayer } from "./agency-semantic-layer.entity";

export class CompanyReviewsData {
  @ApiProperty({ description: "Company semantic layer information", type: AgencySemanticLayer })
  public companyInfo: AgencySemanticLayer;

  @ApiProperty({ description: "Array of reviews for this company", type: [Review] })
  public reviews: Review[];

  constructor(companyInfo: AgencySemanticLayer, reviews: Review[]) {
    this.companyInfo = companyInfo;
    this.reviews = reviews;
  }
}
