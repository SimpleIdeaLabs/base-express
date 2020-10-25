import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { RoleService } from './role.service';
import isAuthenticated from '../../common/middlewares/is-authenticated';
import { IListRolesParams } from './role.dto';
import { plainToClass } from 'class-transformer';

export class RoleController extends BaseController implements IBaseController {

  private roleService: RoleService;

  constructor() {
    super();
    this.roleService = Container.get(RoleService);
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/roles', this.getRoleList);
    this.router.post('/roles', isAuthenticated, this.getRoleList);
  }

  private getRoleList = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const params = await plainToClass(IListRolesParams, query);
      const response = await this.roleService.list(params);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new RoleController();
