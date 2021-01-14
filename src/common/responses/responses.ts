import { Response } from 'express';
import { IResponse } from '../dtos/response.dto';

export const unauthorizedResponse = (response: Response) => {
  const res: IResponse<any> = {
    status: false,
    message: 'Unathorized'
  };
  response.statusCode = 401;
  response.json(res);
};

export const serverErrorResponse = (response: Response) => {
  const res: IResponse<any> = {
    status: false,
    message: 'Server Error'
  };
  response.statusCode = 500;
  response.json(res);
};

export const tooManyRequestResponse = (response: Response) => {
  const res: IResponse<any> = {
    status: false,
    message: 'Too Many Requests'
  };
  response.statusCode = 429;
  response.json(res);
};
