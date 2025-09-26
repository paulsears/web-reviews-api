import { Injectable, Inject } from "@nestjs/common";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { Db, Collection } from "mongodb";
import { Review } from "../model/review.entity";
import { AgencySemanticLayer } from "../model/agency-semantic-layer.entity";
import { CompanyReviewsData } from "../model/company-reviews-data.entity";
import { GetReviewsQueryDto } from "../model/dto/get-reviews-query.dto";

interface AgencySemanticLayerDocument {
  _id: string;
  companyId: number;
  providerId: number;
  apfmPropertyId: number;
  totalReviews: number;
  averageRating: number;
  aiSummary: string;
  aiHighlights: string[];
  aiLastUpdated: Date;
  aiReviewCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

interface ReviewDocument {
  _id?: string;
  _communityId?: string;
  yglCommunityId?: number; // Maps to apfmPropertyId
  orgId?: number; // Maps to providerId
  reviewTitle?: string;
  reviewContent?: string;
  overallRating?: number;
  averageRating?: number;
  reviewerDisplayName?: string;
  domainOwnerName?: string;
  experienceTypeId?: number;
  experienceTypeName?: string;
  relevantCareTypeName?: string;
  experienceType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  // Additional fields that might exist in different collections
  [key: string]: any;
}

@Injectable()
export class ReviewsService {
  private readonly agencySemanticLayerCollection: Collection<AgencySemanticLayerDocument>;
  private readonly reviewsCollection1: Collection<ReviewDocument>;
  private readonly reviewsCollection2: Collection<ReviewDocument>;
  private readonly reviewsCollection3: Collection<ReviewDocument>;

  constructor(
    private readonly logger: Logger,
    @Inject("MONGODB_DATABASE") private readonly db: Db,
  ) {
    this.agencySemanticLayerCollection = this.db.collection<AgencySemanticLayerDocument>("agency_semantic_layer");
    // Actual review collection names
    this.reviewsCollection1 = this.db.collection<ReviewDocument>("agencies_reviews");
    this.reviewsCollection2 = this.db.collection<ReviewDocument>("reviews");
    this.reviewsCollection3 = this.db.collection<ReviewDocument>("google_maps_top_reviews");
  }

  /**
   * Retrieves agency reviews by provider IDs or APFM Property IDs
   * @param query - Query parameters containing provider IDs or APFM Property IDs
   * @returns Promise containing array of agency reviews data
   */
  public async getReviewsByIds(
    query: GetReviewsQueryDto,
  ): Promise<{ companies: CompanyReviewsData[] | null; totalCompanies: number; totalReviews: number }> {
    this.logger.info("Getting agency reviews by IDs", { query });

    try {
      // Build MongoDB filter for agency_semantic_layer collection
      const filter: any = {};
      const orConditions: any[] = [];

      if (query.providerIds && query.providerIds.length > 0) {
        const providerIdsArray = Array.isArray(query.providerIds) ? query.providerIds : [query.providerIds];
        orConditions.push({ providerId: { $in: providerIdsArray } });
      }

      if (query.apfmPropertyIds && query.apfmPropertyIds.length > 0) {
        const apfmPropertyIdsArray = Array.isArray(query.apfmPropertyIds)
          ? query.apfmPropertyIds
          : [query.apfmPropertyIds];
        orConditions.push({ apfmPropertyId: { $in: apfmPropertyIdsArray } });
      }

      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }

      this.logger.debug("Agency semantic layer filter", { filter });

      // Debug: Log collection name and database
      console.log("DEBUG: Collection name:", this.agencySemanticLayerCollection.collectionName);
      console.log("DEBUG: Database name:", this.agencySemanticLayerCollection.dbName);

      // First, get matching agencies from the semantic layer
      const agencyDocuments = await this.agencySemanticLayerCollection.find(filter).toArray();

      // Debug: Log what we found
      console.log("DEBUG: Found documents:", agencyDocuments.length);
      console.log("DEBUG: Documents:", JSON.stringify(agencyDocuments, null, 2));

        if (agencyDocuments.length === 0) {
          this.logger.info("No companies found matching criteria");
          return { companies: null, totalCompanies: 0, totalReviews: 0 };
        }

        // Convert agency documents to entities and fetch reviews for each
        const companyReviewsData: CompanyReviewsData[] = [];
        let totalReviews = 0;

        for (const agencyDoc of agencyDocuments) {
          const companyEntity = new AgencySemanticLayer(
            agencyDoc._id.toString(),
            agencyDoc.companyId,
            agencyDoc.providerId,
            agencyDoc.apfmPropertyId,
            agencyDoc.totalReviews,
            agencyDoc.averageRating,
            agencyDoc.aiSummary,
            agencyDoc.aiHighlights,
            agencyDoc.aiLastUpdated,
            agencyDoc.aiReviewCount,
            agencyDoc.lastUpdated,
            agencyDoc.createdAt,
          );

          // Fetch reviews for this company from all three collections
          const reviews = await this.fetchReviewsForAgency(agencyDoc.providerId, agencyDoc.apfmPropertyId);

          companyReviewsData.push(new CompanyReviewsData(companyEntity, reviews));
          totalReviews += reviews.length;
        }

        this.logger.info(`Found ${agencyDocuments.length} companies with ${totalReviews} total reviews`);
        return {
          companies: companyReviewsData,
          totalCompanies: agencyDocuments.length,
          totalReviews,
        };
    } catch (error) {
      this.logger.error("Error retrieving agency reviews from MongoDB", { error: error.message, query });
      throw error;
    }
  }

  /**
   * Fetches reviews for a specific agency from all three review collections
   * @param providerId - Provider ID to search for
   * @param apfmPropertyId - APFM Property ID to search for
   * @returns Promise containing array of reviews
   */
  private async fetchReviewsForAgency(providerId: number, apfmPropertyId: number): Promise<Review[]> {
    this.logger.debug("Fetching reviews for agency", { providerId, apfmPropertyId });

    const reviewFilter = {
      $or: [
        { orgId: providerId }, // providerId maps to orgId in review collections
        { yglCommunityId: apfmPropertyId }, // apfmPropertyId maps to yglCommunityId
      ],
    };

    try {
      // Fetch from all three collections in parallel
      const [reviews1, reviews2, reviews3] = await Promise.all([
        this.reviewsCollection1.find(reviewFilter).toArray(),
        this.reviewsCollection2.find(reviewFilter).toArray(),
        this.reviewsCollection3.find(reviewFilter).toArray(),
      ]);

      // Combine all reviews and convert to Review entities
      const allReviewDocs = [...reviews1, ...reviews2, ...reviews3];

      const reviews = allReviewDocs.map(
        (doc) =>
          new Review(
            doc._id?.toString() || "",
            (doc.orgId || providerId).toString(),
            (doc.yglCommunityId || apfmPropertyId).toString(),
            doc.reviewTitle || "No Title",
            doc.reviewContent || "No Content",
            doc.overallRating || doc.averageRating || 0,
            doc.reviewerDisplayName || "Anonymous",
            doc.createdAt || doc.publishedAt || new Date(),
            doc.updatedAt || new Date(),
            doc.domainOwnerName,
            doc.experienceTypeId,
            doc.experienceTypeName,
            doc.relevantCareTypeName,
            doc.experienceType,
          ),
      );

      this.logger.debug(`Found ${reviews.length} reviews for agency`, {
        providerId,
        apfmPropertyId,
        collection1Count: reviews1.length,
        collection2Count: reviews2.length,
        collection3Count: reviews3.length,
      });

      return reviews;
    } catch (error) {
      this.logger.error("Error fetching reviews for agency", {
        error: error.message,
        providerId,
        apfmPropertyId,
      });
      return []; // Return empty array on error to not break the entire request
    }
  }

  /**
   * Retrieves agency reviews by provider IDs
   * @param providerIds - Array of provider IDs
   * @returns Promise containing array of agency reviews data
   */
  public async getReviewsByProviderIds(
    providerIds: number[],
  ): Promise<{ companies: CompanyReviewsData[] | null; totalCompanies: number; totalReviews: number }> {
    return this.getReviewsByIds({ providerIds });
  }

  /**
   * Retrieves company reviews by APFM Property IDs
   * @param apfmPropertyIds - Array of APFM Property IDs
   * @returns Promise containing array of company reviews data
   */
  public async getReviewsByApfmPropertyIds(
    apfmPropertyIds: number[],
  ): Promise<{ companies: CompanyReviewsData[] | null; totalCompanies: number; totalReviews: number }> {
    return this.getReviewsByIds({ apfmPropertyIds });
  }
}
