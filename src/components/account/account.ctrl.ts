import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';

export class AccountController extends BaseController implements IBaseController {

  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/accounts/login', this.login);
  }

  private login = async (req: Request, res: Response) => {
    try {
      res.render('pages/login/login');
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new AccountController();
