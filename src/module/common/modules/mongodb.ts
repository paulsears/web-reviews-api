import { Module, Global } from "@nestjs/common";
import { MongoClient, Db } from "mongodb";
import { Logger } from "@aplaceformom/apfm-logger-typescript";
import { applicationConfig } from "../../../config";

@Global()
@Module({
  providers: [
    {
      provide: "MONGODB_CLIENT",
      useFactory: async (logger: Logger): Promise<MongoClient> => {
        try {
          const client = new MongoClient(applicationConfig.mongodb.connectionString, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
          });

          await client.connect();
          logger.info("Successfully connected to MongoDB", {
            connectionString: applicationConfig.mongodb.connectionString,
            databaseName: applicationConfig.mongodb.databaseName,
          });

          return client;
        } catch (error) {
          logger.error("Failed to connect to MongoDB", { error: error.message });
          throw error;
        }
      },
      inject: [Logger],
    },
    {
      provide: "MONGODB_DATABASE",
      useFactory: (client: MongoClient): Db => {
        return client.db(applicationConfig.mongodb.databaseName);
      },
      inject: ["MONGODB_CLIENT"],
    },
  ],
  exports: ["MONGODB_CLIENT", "MONGODB_DATABASE"],
})
export class MongoDbModule {}
