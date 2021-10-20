import { PORT } from './common/configs/env.conf';
import express, { Application, Router, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from './common/middlewares/rate-limiter';
import apiLogger from './common/middlewares/api-logger';
import { Service } from 'typedi';
import account from './components/account/account.ctrl';
import role from './components/roles/role.ctrl';
import organization from './components/organizations/organization.ctrl';
import organizationRoles from './components/organizationRoles/organizationRole.ctrl';
import appRootPath from 'app-root-path';
import { IMAGE_FILES_PATH } from './common/constants/constants';

interface IApp {
  instance: Application;
  registerMiddlewares(): void;
  registerRoutes(): void;
}

@Service()
export class App implements IApp {

  instance: Application;

  constructor() {
    this.instance = express();
    this.registerMiddlewares();
    this.registerRoutes();
  }

  registerMiddlewares() {
    this.instance.set('PORT', PORT);
    this.instance.use(express.json());
    this.instance.use(cors());
    this.instance.use(helmet());
    this.instance.use(rateLimit);
    this.instance.use(apiLogger);
  }

  registerRoutes() {
    const router = Router();
    router.get('/test', (request: Request, response: Response) => {
      response.json({ great: 'work' });
    });
    this.instance.use(router);

    // static routes
    this.instance.use(IMAGE_FILES_PATH, express.static(`${appRootPath}/public/images`));

    // api routes
    const apiV1Router = Router();
    apiV1Router.use(account.router);
    apiV1Router.use(role.router);
    apiV1Router.use(organization.router);
    apiV1Router.use(organizationRoles.router);

    this.instance.use('/api/v1', apiV1Router);
  }

}

export default App;
