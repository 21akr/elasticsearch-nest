import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerService } from './logger';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [LoggerService, AppService],
})
export class AppModule {}
