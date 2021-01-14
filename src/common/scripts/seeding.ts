import 'reflect-metadata';
import { Container } from 'typedi';
import appLogger from '../../common/components/logger/app-logger';
import { Seeding } from '../../common/components/database/seeding/seeding';
import { Database } from '../components/database/database';

const seedContainer = Container.get(Seeding);
const dbContainer = Container.get(Database);

(async () => {
  try {
    await dbContainer.connect();
    await seedContainer.start({
      forced: true
    });
  } catch (err) {
    appLogger.error('Server failed', err);
  }
})();
