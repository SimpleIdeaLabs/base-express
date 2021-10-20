import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';
import { AccountService } from './account.service';
import { Container } from 'typedi';
import { plainToClass } from 'class-transformer';
import { ICreateAccountParams, ILoginParams, IReadAccountParams, IUpdateAccountParams, IListAccountParams } from './account.dto';
import isAuthenticated from '../../common/middlewares/is-authenticated';
import { unauthorizedResponse } from '../../common/responses/responses';

export class AccountController extends BaseController implements IBaseController {

  private accountService: AccountService;

  constructor() {
    super();
    this.accountService = Container.get(AccountService);
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.post('/accounts/login', this.login);
    this.router.get('/accounts', isAuthenticated, this.list);
    this.router.post('/accounts', isAuthenticated, this.create);
    this.router.get('/accounts/get-current-session', isAuthenticated, this.getSession);
    this.router.get('/accounts/:userId', isAuthenticated, this.read);
    this.router.put('/accounts/:userId', isAuthenticated, this.update);
  }

  private login = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const params = await plainToClass(ILoginParams, body);
      const response = await this.accountService.login(params);

      if (!response.status) {
        return unauthorizedResponse(res);
      }

      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private getSession = async (req: Request, res: Response) => {
    try {
      res.json({ user: (req as any).user });
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private list = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const params = await plainToClass(IListAccountParams, query);
      const accounts = await this.accountService.list(params);
      res.json(accounts);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private create = async (req: Request, res: Response) => {
    try {
      const { body, user } = req;
      if (!user) throw new Error('User is not defined');
      const params = await plainToClass(ICreateAccountParams, { ...body });
      const response = await this.accountService.create(params, user);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private read = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const params = await plainToClass(IReadAccountParams, { userId: Number(userId) });
      const response = await this.accountService.read(params);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private update = async (req: Request, res: Response) => {
    try {
      const { body, params: { userId }, user } = req;
      if (!user) throw new Error('User is not defined');
      const params = await plainToClass(IUpdateAccountParams, { ...body, id: +userId });
      const response = await this.accountService.update(params, user);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new AccountController();
