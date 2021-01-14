import { IsNotEmpty, IsOptional } from 'class-validator';
import { Express } from 'express';
import { IPaginationParams } from '../../common/dtos/pagination.dto';
import { Account } from '../account/account.entity';
import { IsOrganizationNameUnique, IsOrganizationRolesExists } from './organization.validators';

export class IListOrganizationFilter {
  organizationRole?: string | string[];
}

export class IListOrganizationParams extends IPaginationParams {

  @IsOptional()
  filter: IListOrganizationFilter;

}

export class ICreateOrganizationParams {

  @IsNotEmpty()
  @IsOrganizationNameUnique({
    message: 'Organization name already used.'
  })
  name: string;

  @IsNotEmpty()
  logo: Express.Multer.File;

  @IsNotEmpty()
  @IsOrganizationRolesExists({
    message: 'Organization role is invalid.'
  })
  organizationRoles: number[];

  @IsOptional()
  administrators?: Account[];

}

export class IReadOrganizationParams {

  @IsNotEmpty()
  orgId: number;

}