import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import isAuthenticated from '../../common/middlewares/is-authenticated';
import { OrganizationRoleService } from './organizationRole.service';

export class OrganizationRoleController extends BaseController implements IBaseController {

  private organizationRoleService: OrganizationRoleService;

  constructor() {
    super();
    this.organizationRoleService = Container.get(OrganizationRoleService);
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/organization-roles', isAuthenticated, this.list);
  }

  private list = async (req: Request, res: Response) => {
    try {
      const organizationRoles = await this.organizationRoleService.list();
      res.json(organizationRoles);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new OrganizationRoleController();
