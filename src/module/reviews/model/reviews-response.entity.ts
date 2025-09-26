import { ApiProperty } from "@nestjs/swagger";
import { CompanyReviewsData } from "./company-reviews-data.entity";

export class ReviewsResponse {
  @ApiProperty({
    description: "Array of company reviews data, null if no matches found",
    type: () => [CompanyReviewsData],
    nullable: true,
  })
  public companies: CompanyReviewsData[] | null;

  @ApiProperty({ description: "Total count of companies found" })
  public totalCompanies: number;

  @ApiProperty({ description: "Total count of reviews across all companies" })
  public totalReviews: number;

  constructor(companies: CompanyReviewsData[] | null, totalCompanies: number, totalReviews: number) {
    this.companies = companies;
    this.totalCompanies = totalCompanies;
    this.totalReviews = totalReviews;
  }
}
