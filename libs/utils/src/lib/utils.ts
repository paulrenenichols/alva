/**
 * @fileoverview Utility functions and helpers for the application
 */

import * as winston from 'winston';

export function utils(): string {
  return 'utils';
}

/**
 * @description Creates a Winston logger instance for a specific service
 * @param serviceName - Name of the service for logging context
 * @returns Configured Winston logger instance
 */
export function createServiceLogger(serviceName: string) {
  return winston.createLogger({
    level: process.env['LOG_LEVEL'] || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });
}
