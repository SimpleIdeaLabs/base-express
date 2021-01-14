import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SIGNATURE } from '../configs/env.conf';
import { serverErrorResponse, unauthorizedResponse } from '../responses/responses';

export default async (request: Request, res: Response, next: NextFunction) => {
  try {
    const { headers } = request;

    // Check Authorization Header
    if (!headers.authorization) {
      return unauthorizedResponse(res);
    }

    // Validate Authorization Header  
    const { authorization } = headers;
    const splitAuthorization = authorization.split('Bearer');
    if (splitAuthorization.length <= 1) {
      return unauthorizedResponse(res);
    }

    // Verify Token
    const token = splitAuthorization[1].trim();
    try {
      const decoded = await jwt.verify(token, JWT_SIGNATURE);

      // TODO verify backend

      request.user = decoded;
    } catch (error) {
      return unauthorizedResponse(res);
    }

    await next();

  } catch (error) {
    return serverErrorResponse(res);
  }
};
