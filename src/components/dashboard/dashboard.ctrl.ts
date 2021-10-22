import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';

export class DashboardController extends BaseController implements IBaseController {

  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.get('/dashboard', this.index);
  }

  private index = async (req: Request, res: Response) => {
    try {
      res.render('pages/dashboard/dashboard');
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new DashboardController();
