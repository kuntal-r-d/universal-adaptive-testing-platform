/**
 * Logger Service
 * RCF: REQ-018 (Audit Logging)
 */

import pino from 'pino';

export type Logger = pino.Logger;

export interface LoggerConfig {
  level?: string;
  name?: string;
  prettyPrint?: boolean;
}

export function createLogger(config: LoggerConfig = {}): Logger {
  const { level = 'info', name = 'uat-api', prettyPrint = false } = config;

  return pino({
    name,
    level,
    transport: prettyPrint
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

