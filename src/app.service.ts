import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  getHello(): string {
    this.logger.info('User requested greeting', this.logMeta());
    this.logger.debug('getHello() executed successfully', this.logMeta());
    return 'Salam!';
  }

  getList(): string {
    this.logger.info('Fetching list of cats', this.logMeta());
    this.logger.debug('Simulating DB call for cats list', this.logMeta());
    return 'List of cats';
  }

  simulateWarning(): string {
    this.logger.warn('This is a warning log: deprecated endpoint usage', {
      ...this.logMeta(),
      endpoint: '/warn',
    });
    return 'Warning issued, check logs';
  }

  triggerError(): string {
    try {
      const result = this.simulateFailure();
      return `Result is ${result}`;
    } catch (error) {
      this.logger.error('Simulated error occurred', {
        ...this.logMeta(),
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
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
