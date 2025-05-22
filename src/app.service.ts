import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    @InjectMetric('http_requests_total')
    private readonly requestCounter: Counter<string>,
  ) {}

  getHello(): string {
    this.logger.info('User requested greeting', this.logMeta());
    this.logger.debug('getHello() executed successfully', this.logMeta());
    this.requestCounter.inc({ method: 'GET', route: '/' });
    return 'Salam!';
  }

  getList(): string {
    this.logger.info('Fetching list of cats', this.logMeta());
    this.logger.debug('Simulating DB call for cats list', this.logMeta());
    this.requestCounter.inc({ method: 'GET', route: '/list' });
    return 'List of cats';
  }

  simulateWarning(): string {
    this.logger.warn('This is a warning log: deprecated endpoint usage', {
      ...this.logMeta(),
      endpoint: '/warn',
    });
    this.requestCounter.inc({ method: 'GET', route: '/warn' });
    return 'Warning issued, check logs';
  }

  triggerError(): string {
    try {
      this.logger.error('Simulated error occurred', {
        ...this.logMeta(),
        error: '(error as Error).message',
        stack: '(error as Error).stack',
      });
      this.requestCounter.inc({ method: 'GET', route: '/error' });
      const result = this.simulateFailure();
      this.requestCounter.inc({ method: 'GET', route: '/error' });
      return `Result is ${result}`;
    } catch (error) {
      this.logger.error('Simulated error occurred', {
        ...this.logMeta(),
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      this.requestCounter.inc({ method: 'GET', route: '/error' });
      return 'An error occurred, check logs';
    }
  }

  private simulateFailure(): number {
    this.logger.debug('simulateFailure() will throw an error', this.logMeta());
    throw new Error('Oops! Something went wrong...');
  }

  private logMeta(): { timestamp: string } {
    return { timestamp: new Date().toISOString() };
  }
}
