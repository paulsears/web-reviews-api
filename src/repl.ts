import { repl } from "@nestjs/core";
import { AppModule } from "./module/application";

async function bootstrap(): Promise<void> {
  await repl(AppModule);
}

bootstrap();
