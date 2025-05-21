import { Injectable, OnModuleInit } from '@nestjs/common';
import * as winston from 'winston';
import {
  ElasticsearchTransport,
  LogData,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

@Injectable()
export class LoggerService implements OnModuleInit {
  private logger!: winston.Logger;

  onModuleInit() {
    const esTransportOpts: ElasticsearchTransportOptions = {
      level: 'info',
      clientOpts: {
        node: process.env.ELASTIC_NODE || 'http://localhost:9200',
      },
      indexPrefix: 'nestjs-logs',
      ensureIndexTemplate: true,
      transformer: (logData: LogData) => ({
        '@timestamp': new Date().toISOString(),
        severity: logData.level,
        message: logData.message as string,
        fields: { ...logData?.meta },
      }),
    };

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `[${String(timestamp)}] ${String(level)}: ${String(message)}`;
          }),
        ),
      }),
      new ElasticsearchTransport(esTransportOpts),
    ];

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports,
    });
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(message, { meta });
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(message, { meta });
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(message, { meta });
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(message, { meta });
  }
}
