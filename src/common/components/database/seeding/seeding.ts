import { Service } from 'typedi';
import { Database } from '../database';
import appLogger from '../../logger/app-logger';
import { AuthSeeding } from './auth.seeding';
import { RoleSeeding } from './role.seeding';
import { Auth } from '../../../../components/auth/auth.entity';

interface IStartSeedParams {
  forced: boolean;
}

@Service()
export class Seeding {

  constructor(
    private db: Database,
    private roleSeeding: RoleSeeding,
    private authSeeding: AuthSeeding,
  ) {}

  public start = async (params?: IStartSeedParams) => {
    appLogger.info('Seeding started...');
    const forced = params?.forced || false;
    const alreadySeeded = await this.checkIfSeeded();
    if (forced || !alreadySeeded) {
      await this.db.reset();
    }
    await this.roleSeeding.start({ forced });
    await this.authSeeding.start({ forced });
    appLogger.info('Seeding is done...');
  }

  private checkIfSeeded = async () => {
    const count = await this.db.sqlManager.count(Auth);
    return count > 0;
  }

}
