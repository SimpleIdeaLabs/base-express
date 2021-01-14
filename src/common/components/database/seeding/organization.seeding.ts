import { Service } from 'typedi';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import Organization from '../../../../components/organizations/organization.entity';
import { IStartSeedParams } from './seeding.dtos';
import { Account } from '../../../../components/account/account.entity';
import { OrganizationRole } from '../../../../components/organizationRoles/organizationRole.entity';
import { In } from 'typeorm';
import { ORGANIZATION_ROLES } from '../../../../components/organizationRoles/organizationRole.constants';
import { OrganizationService } from '../../../../components/organizations/organization.service';

@Service()
export class OrganizationSeeding {

  constructor(
    private db: Database,
    private organizationService: OrganizationService,
  ) {}

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Organization Seeding started...');
    const forced = params?.forced || false;
    if (await this.hasSeeded() && !forced) {
      appLogger.info('Organization Seeding was skipped...');
      return;
    }
    await this.createSystem();
    await this.createPureCare();
  }

  private createSystem = async () => {
    const systemAdmin = await this.db.sqlManager.findOne(Account, {
      where: {
        email: 'system@purecare.com'
      }
    });
    if (!systemAdmin) throw new Error('Missing system account');

    const systemOrgRoles = await this.db.sqlManager.find(OrganizationRole, {
      where: {
        name: In([ORGANIZATION_ROLES.SYSTEM])
      }
    });
    if (!systemOrgRoles) throw new Error('Missing Organization Roles');

    const systemOrg = new Organization();
    systemOrg.name = 'System';
    systemOrg.logo = '';
    systemOrg.administrators = [systemAdmin];
    systemOrg.roles = systemOrgRoles;
    await this.db.sqlManager.save(systemOrg);
  }

  private createPureCare = async () => {
    const pureCareAdmin = await this.db.sqlManager.findOne(Account, {
      where: {
        email: 'admin@purecare.com'
      }
    });
    if (!pureCareAdmin) throw new Error('Missing PureCare admin account');

    const pureCareAdminOrgRoles = await this.db.sqlManager.find(OrganizationRole, {
      where: {
        name: In([ORGANIZATION_ROLES.SUPER_ADMIN])
      }
    });
    if (!pureCareAdminOrgRoles) throw new Error('Missing Organization Roles');
    const systemAccount = new Account();
    systemAccount.id = 1;

    await this.organizationService.create({
      name: 'PureCare',
      organizationRoles: [...pureCareAdminOrgRoles.map(r => r.id)],
      administrators: [pureCareAdmin],
      logo: {
        filename: 'sample.png'
      } as Express.Multer.File
    }, systemAccount);

  }

  private hasSeeded = async () => {
    const data = await this.db.sqlManager.count(Organization);
    return data > 0;
  }

}
