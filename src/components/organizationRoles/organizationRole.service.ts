import { Service } from 'typedi';
import { BaseService } from '../../core/base-service';
import { ORGANIZATION_ROLES } from './organizationRole.constants';
import { OrganizationRole } from './organizationRole.entity';
import { Account } from '../account/account.entity';
import { IResponse } from '../../common/dtos/response.dto';
import { In, Not } from 'typeorm';

@Service()
export class OrganizationRoleService extends BaseService {

  public create = async (name: ORGANIZATION_ROLES, currentUser: Account): Promise<IResponse<OrganizationRole>> => {
    const { id: currentUserId } = currentUser;
    const newOrganizationRole = new OrganizationRole();
    newOrganizationRole.name = name;
    newOrganizationRole.createdById = currentUserId;
    newOrganizationRole.updatedById = currentUserId;
    await this.database.sqlManager.save(newOrganizationRole);
    return {
      data: newOrganizationRole,
      status: true
    };
  }

  public list = async (): Promise<IResponse<OrganizationRole[]>> => {
    const organizationRoles = await this.database.sqlManager.find(OrganizationRole, {
      where: {
        name: Not(In([ORGANIZATION_ROLES.SYSTEM, ORGANIZATION_ROLES.SUPER_ADMIN]))
      }
    });
    return {
      data: organizationRoles,
      status: true
    };
  }

}
