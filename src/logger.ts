/* eslint-disable @typescript-eslint/no-explicit-any */
import expressWinston from 'express-winston';
import winston from 'winston';
import 'winston-mongodb';
import { config } from './env';

const mongoDbTransports = winston.transports as any;

const getDefaultTransports = (logger: string) => {
  const defaultTransports: any[] = [];
  defaultTransports.push(
    // tslint:disable-next-line:no-string-literal
    new mongoDbTransports['MongoDB']({
      db: config.MONGO_DB_URL,
      collection: `${logger}_logs`,
      capped: false
    }) as any
  );
  defaultTransports.push(
    new winston.transports.Console({
      format: winston.format.prettyPrint()
    })
  );
  return defaultTransports;
};

const defaultTransportFormat = winston.format.combine(
  winston.format.simple(),
  winston.format.metadata()
);

export const apiLogger = expressWinston.logger({
  transports: getDefaultTransports('api'),
  requestWhitelist: [
    ...expressWinston.requestWhitelist,
    'body',
    'headers',
    'query'
  ],
  responseWhitelist: [...expressWinston.responseWhitelist, 'body'],
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  format: defaultTransportFormat
});

export const appLogger = winston.createLogger({
  format: defaultTransportFormat,
  transports: getDefaultTransports('app')
});
