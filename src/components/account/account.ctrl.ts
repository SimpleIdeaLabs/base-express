import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';

export class AccountController extends BaseController implements IBaseController {

  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/accounts/login', this.login);
    this.router.get('/accounts/verify-otp', this.otp);
    this.router.get('/accounts/select-role', this.roles);
  }

  private login = async (req: Request, res: Response) => {
    try {
      res.render('pages/login/login');
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private otp = async (req: Request, res: Response) => {
    try {
      res.render('pages/login/otp');
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private roles = async (req: Request, res: Response) => {
    try {
      res.render('pages/login/roles');
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new AccountController();
