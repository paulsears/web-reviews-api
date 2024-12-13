import { Module } from "@nestjs/common";
import { HealthCheckController } from "../controller/health-check.controller";
import { PingController } from "../controller/ping.controller";
import { HealthCheckService } from "../service/health-check";

@Module({
  imports: [],
  controllers: [HealthCheckController, PingController],
  providers: [HealthCheckService],
})
export class StatusModule {}
