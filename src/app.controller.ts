import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('list')
  getList(): string {
    return this.appService.getList();
  }

  @Get('warn')
  simulateWarning(): string {
    return this.appService.simulateWarning();
  }

  @Get('error')
  triggerError(): string {
    return this.appService.triggerError();
  }
}
