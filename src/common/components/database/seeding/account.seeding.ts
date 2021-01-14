import { Service } from 'typedi';
import { Account } from '../../../../components/account/account.entity';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import { Role } from '../../../../components/roles/role.entity';
import { SUPPORTED_ROLES } from '../../../../components/roles/role.constants';
import { AccountService } from '../../../../components/account/account.service';

interface IStartSeedParams {
  forced: boolean;
}

@Service()
export class AccountSeeding {

  constructor(
    private db: Database,
    private accountService: AccountService
  ) {}

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Account Seeding started...');
    const forced = params?.forced || false;
    if (await this.hasSeeded() && !forced) {
      appLogger.info('Account Seeding was skipped...');
      return;
    }
    await this.createSystemAdmin();
    await this.createPureCareAdmin();
    appLogger.info('Account Seeding is done...');
  }

  private createSystemAdmin = async () => {
    const systemAccountRoles = await this.db.sqlManager.find(Role, {
      where: [
        { name: SUPPORTED_ROLES.SYSTEM }
      ]
    });
    const systemAccount = this.db.sqlManager.create(Account, {
      email: 'system@purecare.com'
    });
    systemAccount.setPassword('123456');
    systemAccount.roles = systemAccountRoles;
    await this.db.sqlManager.save(systemAccount);
  }

  private createPureCareAdmin = async () => {
    const superAdminRole = await this.db.sqlManager.findOne(Role, {
      where: [
        { name: SUPPORTED_ROLES.SUPER_ADMIN }
      ]
    });

    if (!superAdminRole) throw new Error('System role not found');
    const { data: systemAccount } = await this.accountService.read({ userId: 1 });

    await this.accountService.create({
      email: 'admin@purecare.com',
      password: '123456',
      confirmPassword: '123456',
      role: superAdminRole.id
    }, systemAccount as Account);
  }

  private hasSeeded = async () => {
    const data = await this.db.sqlManager.count(Account);
    return data > 0;
  }

}
