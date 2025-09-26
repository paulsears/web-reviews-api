import { ApiProperty } from "@nestjs/swagger";

export class Review {
  @ApiProperty({ description: "Unique identifier for the review" })
  public id: string;

  @ApiProperty({ description: "Provider ID associated with the review" })
  public providerId: string;

  @ApiProperty({ description: "YGL ID associated with the review" })
  public yglId: string;

  @ApiProperty({ description: "Review title" })
  public title: string;

  @ApiProperty({ description: "Review content/body" })
  public content: string;

  @ApiProperty({ description: "Rating given in the review", minimum: 1, maximum: 5 })
  public rating: number;

  @ApiProperty({ description: "Author of the review" })
  public author: string;

  @ApiProperty({ description: "Domain owner name (e.g., senioradvisor.com)", required: false })
  public domainOwnerName?: string;

  @ApiProperty({ description: "Experience type ID", required: false })
  public experienceTypeId?: number;

  @ApiProperty({ description: "Experience type name", required: false })
  public experienceTypeName?: string;

  @ApiProperty({ description: "Relevant care type name", required: false })
  public relevantCareTypeName?: string;

  @ApiProperty({ description: "Experience type description", required: false })
  public experienceType?: string;

  @ApiProperty({ description: "Date when the review was created" })
  public createdAt: Date;

  @ApiProperty({ description: "Date when the review was last updated" })
  public updatedAt: Date;

  constructor(
    id: string,
    providerId: string,
    yglId: string,
    title: string,
    content: string,
    rating: number,
    author: string,
    createdAt: Date,
    updatedAt: Date,
    domainOwnerName?: string,
    experienceTypeId?: number,
    experienceTypeName?: string,
    relevantCareTypeName?: string,
    experienceType?: string,
  ) {
    this.id = id;
    this.providerId = providerId;
    this.yglId = yglId;
    this.title = title;
    this.content = content;
    this.rating = rating;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.domainOwnerName = domainOwnerName;
    this.experienceTypeId = experienceTypeId;
    this.experienceTypeName = experienceTypeName;
    this.relevantCareTypeName = relevantCareTypeName;
    this.experienceType = experienceType;
  }
}
