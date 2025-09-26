import { Controller, Get, Query, BadRequestException, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { ReviewsService } from "../service/reviews.service";
import { GetReviewsQueryDto } from "../model/dto/get-reviews-query.dto";
import { ReviewsResponse } from "../model/reviews-response.entity";
import { STATUS_MESSAGE_INTERNAL_SERVER_ERROR } from "../../../config/constants";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly logger: Logger,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: "Get reviews by provider IDs or YGL IDs",
    description: "Retrieves company reviews filtered by provider IDs or APFM Property IDs. At least one filter must be provided.",
  })
  @ApiQuery({
    name: "providerIds",
    required: false,
    type: [Number],
    description: "Array of provider IDs to filter reviews by",
    example: [924, 1234],
  })
  @ApiQuery({
    name: "apfmPropertyIds",
    required: false,
    type: [Number],
    description: "Array of APFM Property IDs (YGL IDs) to filter reviews by",
    example: [123203, 5678],
  })
  @ApiResponse({
    status: 200,
    type: ReviewsResponse,
    description: "Successfully retrieved reviews",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - missing required parameters",
  })
  @ApiResponse({
    status: 500,
    description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
  })
  public async getReviews(@Query() query: GetReviewsQueryDto): Promise<ReviewsResponse> {
    this.logger.info("Getting agency reviews", { query });

    // Validate that at least one filter is provided
    if (!query.providerIds && !query.apfmPropertyIds) {
      throw new BadRequestException("At least one of providerIds or apfmPropertyIds must be provided");
    }

    try {
          const result = await this.reviewsService.getReviewsByIds(query);

          this.logger.info(`Successfully retrieved ${result.totalCompanies} companies with ${result.totalReviews} total reviews`);
          return new ReviewsResponse(result.companies, result.totalCompanies, result.totalReviews);
    } catch (error) {
      this.logger.error("Error getting agency reviews", { error: error.message, query });
      throw error;
    }
  }

  @Get("by-provider")
  @ApiOperation({
    summary: "Get agency reviews by provider IDs",
    description: "Retrieves agency reviews filtered by provider IDs only.",
  })
  @ApiQuery({
    name: "providerIds",
    required: true,
    type: [Number],
    description: "Array of provider IDs to filter reviews by",
    example: [924, 1234],
  })
  @ApiResponse({
    status: 200,
    type: ReviewsResponse,
    description: "Successfully retrieved agency reviews by provider IDs",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - missing provider IDs",
  })
  @ApiResponse({
    status: 500,
    description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
  })
  public async getReviewsByProvider(@Query("providerIds") providerIds: number[]): Promise<ReviewsResponse> {
    this.logger.info("Getting agency reviews by provider IDs", { providerIds });

    if (!providerIds || providerIds.length === 0) {
      throw new BadRequestException("Provider IDs are required");
    }

    // Ensure providerIds is an array (in case single value is passed) and convert to numbers
    const providerIdsArray = Array.isArray(providerIds) 
      ? providerIds.map(id => typeof id === 'number' ? id : parseInt(String(id), 10))
      : [typeof providerIds === 'number' ? providerIds : parseInt(String(providerIds), 10)];

    try {
      const result = await this.reviewsService.getReviewsByProviderIds(providerIdsArray);
      
      this.logger.info(`Successfully retrieved ${result.totalCompanies} companies with ${result.totalReviews} total reviews for providers`);
      return new ReviewsResponse(result.companies, result.totalCompanies, result.totalReviews);
    } catch (error) {
      this.logger.error("Error getting agency reviews by provider IDs", { error: error.message, providerIds });
      throw error;
    }
  }

  @Get("by-apfm-property")
  @ApiOperation({
    summary: "Get agency reviews by APFM Property IDs",
    description: "Retrieves agency reviews filtered by APFM Property IDs (YGL IDs) only.",
  })
  @ApiQuery({
    name: "apfmPropertyIds",
    required: true,
    type: [Number],
    description: "Array of APFM Property IDs to filter reviews by",
    example: [123203, 5678],
  })
  @ApiResponse({
    status: 200,
    type: ReviewsResponse,
    description: "Successfully retrieved agency reviews by APFM Property IDs",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - missing APFM Property IDs",
  })
  @ApiResponse({
    status: 500,
    description: STATUS_MESSAGE_INTERNAL_SERVER_ERROR,
  })
  public async getReviewsByApfmProperty(@Query("apfmPropertyIds") apfmPropertyIds: number[]): Promise<ReviewsResponse> {
    this.logger.info("Getting agency reviews by APFM Property IDs", { apfmPropertyIds });

    if (!apfmPropertyIds || apfmPropertyIds.length === 0) {
      throw new BadRequestException("APFM Property IDs are required");
    }

    // Ensure apfmPropertyIds is an array (in case single value is passed) and convert to numbers
    const apfmPropertyIdsArray = Array.isArray(apfmPropertyIds) 
      ? apfmPropertyIds.map(id => typeof id === 'number' ? id : parseInt(String(id), 10))
      : [typeof apfmPropertyIds === 'number' ? apfmPropertyIds : parseInt(String(apfmPropertyIds), 10)];

    try {
      const result = await this.reviewsService.getReviewsByApfmPropertyIds(apfmPropertyIdsArray);
      
      this.logger.info(`Successfully retrieved ${result.totalCompanies} companies with ${result.totalReviews} total reviews for APFM Property IDs`);
      return new ReviewsResponse(result.companies, result.totalCompanies, result.totalReviews);
    } catch (error) {
      this.logger.error("Error getting agency reviews by APFM Property IDs", { error: error.message, apfmPropertyIds });
      throw error;
    }
  }
}
