import { Module } from '@nestjs/common';
import { AppController } from '../controller/application';
import { AppService } from '../service/application';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
