import { ValidationError } from "class-validator";
import { IPaginationResponse } from '../dtos/pagination.dto';

export class IResponse {

  status: boolean;

  validationErrors?: ValidationError[];

  serverErrors?: any;

  message?: string;

  data?: any;

}

export class IPaginatedResponse extends IResponse {

  pagination?: IPaginationResponse;

}
