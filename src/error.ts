import { NextFunction, Request, Response } from 'express';
import { appLogger } from './logger';

type ExError = Error & { code?: string; statusCode?: string; meta: unknown };

export function errorHandler(
  err: ExError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  appLogger.error(err.code || 'UnknownError', {
    code: err.code || err.name || 'UnknownError',
    title: err.message,
    meta: err.meta
  });

  return res.status(500).json({
    message: 'something went wrong.'
  });
}
