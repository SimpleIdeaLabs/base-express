import { Service } from 'typedi';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import { Role } from '../../../../components/roles/role.entity';
import { SUPPORTED_ROLES } from '../../../../components/roles/role.constants';
import { IStartSeedParams } from './seeding.dtos';

@Service()
export class RoleSeeding {

  constructor(
    private db: Database
  ) {}

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Role Seeding started...');
    const forced = params?.forced || false;
    if (await this.hasSeeded() && !forced) {
      appLogger.info('Role Seeding was skipped...');
      return;
    }

    const roles: Role[] = [];

    const systemRole = new Role();
    systemRole.name = SUPPORTED_ROLES.SYSTEM;
    roles.push(systemRole);

    const superAdminRole = new Role();
    superAdminRole.name = SUPPORTED_ROLES.SUPER_ADMIN;
    roles.push(superAdminRole);

    const groupOrgRole = new Role();
    groupOrgRole.name = SUPPORTED_ROLES.GROUP_ADMIN;
    roles.push(groupOrgRole);

    const serviceProviderRole = new Role();
    serviceProviderRole.name = SUPPORTED_ROLES.SERVICE_PROVIDER;
    roles.push(serviceProviderRole);

    await this.db.sqlManager.save(roles);

    appLogger.info('Auth Seeding is done...');
  }

  private hasSeeded = async () => {
    const data = await this.db.sqlManager.count(Role);
    return data > 0;
  }

}
