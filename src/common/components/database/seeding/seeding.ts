import { Service } from 'typedi';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import { AccountSeeding } from './account.seeding';
import { RoleSeeding } from './role.seeding';
import { Account } from '../../../../components/account/account.entity';
import { OrganizationSeeding } from './organization.seeding';
import { OrganizationRoleSeeding } from './organizationRole.seeding';
import { getConnection } from 'typeorm';

interface IStartSeedParams {
  forced: boolean;
}

@Service()
export class Seeding {

  constructor(
    private db: Database,
    private roleSeeding: RoleSeeding,
    private accountSeeding: AccountSeeding,
    private organizationSeeding: OrganizationSeeding,
    private organizationRolesSeeding: OrganizationRoleSeeding
  ) {}

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Seeding started...');
    const forced = params?.forced || false;
    const alreadySeeded = await this.checkIfSeeded();
    if (forced || !alreadySeeded) {
      await getConnection().synchronize(true);
      await this.db.reset();
    }
    await this.roleSeeding.start({ forced });
    await this.accountSeeding.start({ forced });
    await this.organizationRolesSeeding.start({ forced });
    await this.organizationSeeding.start({ forced });

    appLogger.info('Seeding is done...');
  }

  private checkIfSeeded = async () => {
    const count = await this.db.sqlManager.count(Account);
    return count > 0;
  }

}
