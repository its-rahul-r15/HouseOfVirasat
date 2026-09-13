import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: env.NODE_ENV === 'production'
    ? combine(timestamp(), json())
    : combine(colorize(), simple()),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});

export default logger;
