import { Global, Module } from "@nestjs/common";
import { applicationConfig } from "../../../config";

@Global()
@Module({
  providers: [
    {
      provide: "APP_CONFIG", // Use a unique token for injection
      useValue: applicationConfig, // Pass the variable here
    },
  ],
  exports: ["APP_CONFIG"], // Export the provider if it needs to be used in other modules
})
export class AppConfigModule {}
