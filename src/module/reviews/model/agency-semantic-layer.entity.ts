import { ApiProperty } from "@nestjs/swagger";

export class AgencySemanticLayer {
  @ApiProperty({ description: "MongoDB document ID" })
  public id: string;

  @ApiProperty({ description: "Company identifier" })
  public companyId: number;

  @ApiProperty({ description: "Provider identifier" })
  public providerId: number;

  @ApiProperty({ description: "APFM Property ID (YGL ID)" })
  public apfmPropertyId: number;

  @ApiProperty({ description: "Total number of reviews" })
  public totalReviews: number;

  @ApiProperty({ description: "Average rating across all reviews", minimum: 1, maximum: 5 })
  public averageRating: number;

  @ApiProperty({ description: "AI-generated summary of reviews" })
  public aiSummary: string;

  @ApiProperty({ description: "AI-generated highlights from reviews", type: [String] })
  public aiHighlights: string[];

  @ApiProperty({ description: "Date when AI summary was last updated" })
  public aiLastUpdated: Date;

  @ApiProperty({ description: "Number of reviews used for AI analysis" })
  public aiReviewCount: number;

  @ApiProperty({ description: "Date when record was last updated" })
  public lastUpdated: Date;

  @ApiProperty({ description: "Date when record was created" })
  public createdAt: Date;

  constructor(
    id: string,
    companyId: number,
    providerId: number,
    apfmPropertyId: number,
    totalReviews: number,
    averageRating: number,
    aiSummary: string,
    aiHighlights: string[],
    aiLastUpdated: Date,
    aiReviewCount: number,
    lastUpdated: Date,
    createdAt: Date,
  ) {
    this.id = id;
    this.companyId = companyId;
    this.providerId = providerId;
    this.apfmPropertyId = apfmPropertyId;
    this.totalReviews = totalReviews;
    this.averageRating = averageRating;
    this.aiSummary = aiSummary;
    this.aiHighlights = aiHighlights;
    this.aiLastUpdated = aiLastUpdated;
    this.aiReviewCount = aiReviewCount;
    this.lastUpdated = lastUpdated;
    this.createdAt = createdAt;
  }
}
