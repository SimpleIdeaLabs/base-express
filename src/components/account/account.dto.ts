import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IPaginationParams } from '../../common/dtos/pagination.dto';
import { IsMatch, IsAccountEmailUnique } from './account.validators';

export class ILoginParams {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}

export class ICreateAccountParams {

  @IsNotEmpty()
  @IsString()
  @IsAccountEmailUnique({
    message: 'Email already in use'
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsMatch('password', {
    message: 'Please confirm your password.'
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsNumber()
  role: number;

}

export class IUpdateAccountParams {

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsAccountEmailUnique({
    message: 'Email already in use'
  })
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @IsMatch('password', {
    message: 'Please confirm your password.'
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsNumber()
  role: number;

}

export class IReadAccountParams {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class IListAccountParams extends IPaginationParams {}
