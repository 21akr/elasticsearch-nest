import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerService } from './logger';
import { AppService } from './app.service';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [AppController],
  providers: [
    LoggerService,
    AppService,

    makeCounterProvider({
      name: 'http_total_requests',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route'],
    }),
  ],
})
export class AppModule {}
