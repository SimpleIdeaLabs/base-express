import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IPaginationParams } from '../../common/dtos/pagination.dto';
import { IsMatch, IsAuthEmailUnique } from './auth.validators';

export class ILoginParams {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}

export class ICreateAuthParams {

  @IsNotEmpty()
  @IsString()
  @IsAuthEmailUnique({
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

export class IUpdateAuthParams {

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsAuthEmailUnique({
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

export class IReadAuthParams {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class IListAuthParams extends IPaginationParams {}
