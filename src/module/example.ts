import { Module } from "@nestjs/common";
import { ExampleController } from "../controller/example.controller";
import { ExampleHttpClientUsage } from "../service/example-http-client-usage";

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [ExampleHttpClientUsage],
})
export class ExampleModule {}
