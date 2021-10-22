import { isProduction, isTest } from '../../configs/env.conf';
import winston from 'winston';

export const getDefaultTransports = (logger: string) => {
  const defaultTransports = [];

  if (!isProduction() && !isTest()) {
    defaultTransports.push(
      new winston.transports.Console({
        format: winston.format.prettyPrint()
      })
    );
  }
  return defaultTransports;

};
