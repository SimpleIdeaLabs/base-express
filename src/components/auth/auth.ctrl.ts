import { BaseController, IBaseController } from '../../core/base-ctrl';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Container } from 'typedi';
import { plainToClass } from 'class-transformer';
import { ICreateAuthParams, ILoginParams, IReadAuthParams, IUpdateAuthParams, IListAuthParams } from './auth.dtos';
import isAuthenticated from '../../common/middlewares/is-authenticated';
import { unathorizedResponse } from '../../common/responses/responses';

export class AuthController extends BaseController implements IBaseController {

  private authService: AuthService;

  constructor() {
    super();
    this.authService = Container.get(AuthService);
    this.registerRoutes();
  }

  registerRoutes(): void {
    this.router.post('/auth/login', this.login);
    this.router.get('/auth', isAuthenticated, this.list);
    this.router.post('/auth', isAuthenticated, this.create);
    this.router.get('/auth/get-current-session', isAuthenticated, this.getSession);
    this.router.get('/auth/:userId', isAuthenticated, this.read);
    this.router.put('/auth/:userId', isAuthenticated, this.update);
  }

  private login = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const params = await plainToClass(ILoginParams, body);
      const response = await this.authService.login(params);

      if (!response.status) {
        return unathorizedResponse(res);
      }

      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private getSession = async (req: Request, res: Response) => {
    try {
      res.json({ user: (req as any).user});
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private list = async (req: Request, res: Response) => {
    try {
      const { query } = req;
      const params = await plainToClass(IListAuthParams, query);
      const auths = await this.authService.list(params);
      res.json(auths);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private create = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const params = await plainToClass(ICreateAuthParams, { ...body });
      const response = await this.authService.create(params);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private read = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const params = await plainToClass(IReadAuthParams, { userId: Number(userId) });
      const response = await this.authService.read(params);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

  private update = async (req: Request, res: Response) => {
    try {
      const { body, params: { userId }  } = req;
      const params = await plainToClass(IUpdateAuthParams, { ...body, id: +userId });
      const response = await this.authService.update(params);
      res.json(response);
    } catch (error) {
      this.serverError(res, { meta: error });
    }
  }

}

export default new AuthController();
