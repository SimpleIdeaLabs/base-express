import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { AccountService } from '../../components/account/account.service';
import { JWT_SIGNATURE } from '../configs/env.conf';
import { serverErrorResponse, unauthorizedResponse } from '../responses/responses';
import * as _ from 'lodash';

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

      // Backend verification
      const accountService = Container.get(AccountService);
      const user = await accountService.read({
        userId: _.get(decoded, 'id', -1)
      });
      if (!user.data || !user.status) {
        return unauthorizedResponse(res);
      }
      request.user = user.data;
    } catch (error) {
      return unauthorizedResponse(res);
    }
    await next();
  } catch (error) {
    return serverErrorResponse(res);
  }
};
