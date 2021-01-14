import { Service } from 'typedi';
import { BaseService } from '../../core/base-service';
import { validate } from 'class-validator';
import { IPaginatedResponse, IResponse } from '../../common/dtos/response.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { Database } from '../../common/components/database/database';
import { ICreateOrganizationParams, IListOrganizationFilter, IListOrganizationParams, IReadOrganizationParams } from './organization.dto';
import Organization from './organization.entity';
import { Account } from '../account/account.entity';
import { plainToClass } from 'class-transformer';
import { OrganizationRole } from '../organizationRoles/organizationRole.entity';
import { IMAGE_FILES_PATH } from '../../common/constants/constants';
import { In } from 'typeorm';

@Service()
export class OrganizationService extends BaseService {

  constructor(
    private paginationService: PaginationService,
    public database: Database
  ) {
    super(database);
  }

  public list = async (params: IListOrganizationParams): Promise<IPaginatedResponse<Organization[]>> => {
    const errors = await validate(params);
    if (errors && errors.length) {
      return {
        status: false,
        validationErrors: errors
      };
    }

    const { page, limit, filter } = params;
    const filterObject = plainToClass(IListOrganizationFilter, JSON.parse(decodeURIComponent(filter as string))) || null;
    const organizationRole = filterObject?.organizationRole;

    const { data: total } = await this.total(organizationRole);
    const skip = this.paginationService.skip(page, limit);

    const organizationListQuery = this.database.sqlManager.createQueryBuilder()
      .select('organization')
      .from(Organization, 'organization')
      .leftJoinAndSelect('organization.roles', 'organizationRoles');

    // check organization role
    if (organizationRole) {
      if (Array.isArray(organizationRole)) {
        organizationListQuery
          .where('organizationRoles.name IN (:organizationRole)', { organizationRole });
      } else {
        organizationListQuery
          .where('organizationRoles.name = :organizationRole', { organizationRole });
      }
      organizationListQuery
        .take(+limit)
        .skip(skip);
    }

    const organizationListRaw = await organizationListQuery.getMany();

    // format logo with file path
    const organizationListFormatted = organizationListRaw.map(org => ({
      ...org,
      logo: `${IMAGE_FILES_PATH}/${org.logo}`
    }));

    return {
      data: organizationListFormatted,
      status: true,
      pagination: {
        total,
        currentPage: +page
      }
    };
  }

  public total = async (organizationRole: any): Promise<IResponse<number>> => {
    const organizationListQuery = this.database.sqlManager.createQueryBuilder()
      .select('organization')
      .from(Organization, 'organization')
      .leftJoinAndSelect('organization.roles', 'organizationRoles');

    if (organizationRole) {
      if (Array.isArray(organizationRole)) {
        organizationListQuery
          .where('organizationRoles.name IN (:organizationRole)', { organizationRole });
      } else {
        organizationListQuery
          .where('organizationRoles.name = :organizationRole', { organizationRole });
      }
    }
    const total = await organizationListQuery.getCount();
    return {
      data: total,
      status: true
    };
  }

  public create = async (params: ICreateOrganizationParams, currentUser: Account): Promise<IResponse<Organization>> => {
    const errors = await validate(params);
    if (errors && errors.length) {
      return {
        status: false,
        validationErrors: errors
      };
    }

    const { name, logo, organizationRoles, administrators } = params;
    const { id: currentUserId } = currentUser;
    const organizationRolesMap = await this.database.sqlManager.find(OrganizationRole, {
      where: {
        id: In(organizationRoles)
      }
    });

    const newOrganization = new Organization();
    newOrganization.name = name;
    newOrganization.logo = logo.filename;
    newOrganization.roles = organizationRolesMap;

    // create administrators
    if (administrators) {
      newOrganization.administrators = administrators;
    }

    newOrganization.createdById = currentUserId;
    newOrganization.updatedById = currentUserId;
    await this.database.sqlManager.save(newOrganization);

    return {
      data: newOrganization,
      status: true
    };
  }

  public read = async (params: IReadOrganizationParams): Promise<IResponse<Organization | null>> => {
    const errors = await validate(params);
    if (errors && errors.length) {
      return {
        status: false,
        validationErrors: errors
      };
    }
    const { orgId } = params;
    const org = await this.database.sqlManager.findOne(Organization, {
      where: {
        id: orgId
      }
    });
    return {
      data: org || null,
      status: true
    };
  }

}
