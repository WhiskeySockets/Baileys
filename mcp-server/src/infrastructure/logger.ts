/**
 * Logger configuration for MCP Server
 * Uses pino for structured logging
 */

import pino from 'pino';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const logger = pino({
  name: 'whatsapp-mcp',
  level: LOG_LEVEL,
  transport: process.env.NODE_ENV !== 'production' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          destination: 2, // Write to stderr
        },
      }
    : undefined,
}, pino.destination(2));

export type Logger = typeof logger;

export const createChildLogger = (name: string): Logger => {
  return logger.child({ component: name });
};
