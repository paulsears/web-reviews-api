import { clientFactory } from "@aplaceformom/apfm-nestjs-client-factory";
import { AppModule } from "module/application";

clientFactory(AppModule, { version: '0.0.1' });
