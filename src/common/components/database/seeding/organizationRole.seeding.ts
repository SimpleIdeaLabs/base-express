import { Service } from 'typedi';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import { IStartSeedParams } from './seeding.dtos';
import { OrganizationRole } from '../../../../components/organizationRoles/organizationRole.entity';
import { ORGANIZATION_ROLES } from '../../../../components/organizationRoles/organizationRole.constants';
import { OrganizationRoleService } from '../../../../components/organizationRoles/organizationRole.service';
import { Account } from '../../../../components/account/account.entity';

@Service()
export class OrganizationRoleSeeding {

  constructor(
    private db: Database,
    private organizationRoleService: OrganizationRoleService
  ) { }

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Role Seeding started...');
    const forced = params?.forced || false;
    if (await this.hasSeeded() && !forced) {
      appLogger.info('Role Seeding was skipped...');
      return;
    }

    // Non System Roles
    const systemAccount = new Account();
    systemAccount.id = 1;

    await this.organizationRoleService.create(ORGANIZATION_ROLES.SYSTEM, systemAccount);
    await this.organizationRoleService.create(ORGANIZATION_ROLES.SUPER_ADMIN, systemAccount);
    await this.organizationRoleService.create(ORGANIZATION_ROLES.GROUP_ORGANIZATION, systemAccount);
    await this.organizationRoleService.create(ORGANIZATION_ROLES.SERVICE_PROVIDER, systemAccount);

    appLogger.info('Organization Roles Seeding is done...');
  }

  private hasSeeded = async () => {
    const data = await this.db.sqlManager.count(OrganizationRole);
    return data > 0;
  }

}
