import { Module } from "@nestjs/common";
import { ReviewsController } from "./controller/reviews.controller";
import { ReviewsService } from "./service/reviews.service";
import { MongoDbModule } from "../common/modules/mongodb";

@Module({
  imports: [MongoDbModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
