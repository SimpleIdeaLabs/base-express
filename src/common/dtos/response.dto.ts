import { ValidationError } from 'class-validator';
export class IResponse<T> {

  status: boolean;

  validationErrors?: ValidationError[];

  serverErrors?: any;

  message?: string;

  data?: T;

}
