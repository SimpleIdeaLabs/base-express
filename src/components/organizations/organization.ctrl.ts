import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { plainToClass } from 'class-transformer';
import isAuthenticated from '../../common/middlewares/is-authenticated';
import { OrganizationService } from './organization.service';
import { ICreateOrganizationParams, IListOrganizationParams, IReadOrganizationParams } from './organization.dto';
import { imageUpload } from '../../common/middlewares/image-upload';

export class OrganizationController extends BaseController implements IBaseController {

  private organizationService: OrganizationService;

  constructor() {
    super();
    this.organizationService = Container.get(OrganizationService);
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/organizations', isAuthenticated, this.list);
    this.router.post('/organizations', isAuthenticated, imageUpload.single('logo'), this.create);
    this.router.get('/organizations/:orgId', isAuthenticated, this.read);
  }

  private list = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const params = await plainToClass(IListOrganizationParams, query);
      const accounts = await this.organizationService.list(params);
      res.json(accounts);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private create = async (req: Request, res: Response) => {
    try {
      const { body, user, file } = req;
      if (!user) throw new Error('User is not defined');
      const params = await plainToClass(ICreateOrganizationParams, { ...body, logo: file });
      const response = await this.organizationService.create(params, user);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private read = async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const params = await plainToClass(IReadOrganizationParams, { orgId });
      const org = await this.organizationService.read(params);
      res.json(org);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new OrganizationController();
