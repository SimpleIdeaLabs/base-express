import { ValidationError } from 'class-validator';
import { IPaginationResponse } from '../dtos/pagination.dto';

export class IResponse<T> {

  status: boolean;

  validationErrors?: ValidationError[];

  serverErrors?: any;

  message?: string;

  data?: T;

}

export class IPaginatedResponse<T> extends IResponse<T> {

  pagination?: IPaginationResponse;

}
