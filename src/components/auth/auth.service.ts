import { Service } from 'typedi';
import { Auth } from './auth.entity';
import { BaseService } from '../../core/base-service';
import { ICreateAuthParams, IListAuthParams, ILoginParams, IReadAuthParams, IUpdateAuthParams } from './auth.dtos';
import { validate } from 'class-validator';
import { IPaginatedResponse, IResponse } from '../../common/dtos/response.dto';
import { authError, loginError, roleError } from './auth.errors';
import { Role } from '../roles/role.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { Database } from '../../common/components/database/database';

@Service()
export class AuthService extends BaseService {

  constructor(
    private paginationService: PaginationService,
    public database: Database
  ) {
    super(database);
  }

  // TODO REMOVE
  public getAuth = async (): Promise<Auth[]> => {
    try {
      const auth = await this.database.sqlManager.find(Auth);
      return auth;
    } catch (error) {
      throw error;
    }
  }

  // TODO REMOVE
  public saveAuth = async (): Promise<Auth> => {
    try {
      const auth = await this.database.sqlManager.transaction(async transactionEntityManager => {
        const newAuth = new Auth();
        newAuth.email = 'markernest.matute@gmail.com';
        newAuth.setPassword('1234567');
        await transactionEntityManager.save(newAuth);
        return newAuth;
      });
      return auth;
    } catch (error) {
      throw error;
    }
  }

  public login = async (params: ILoginParams): Promise<IResponse> => {
    try {
      // Validation
      const errors = await validate(params);
      if (errors && errors.length > 0) {
        return {
          validationErrors: errors,
          status: false
        };
      }

      // Spread params
      const { email, password } = params;

      // Check if email exists
      const auth = await this.database.sqlManager.findOne(Auth, {
        where: {
          email
        },
        relations: ['roles']
      });
      if (!auth || (auth && !auth.checkPassword(password))) {
        return {
          validationErrors: [loginError],
          status: false
        };
      }

      return {
        data: {
          token: await auth.toJWT()
        },
        status: true
      };

    } catch (error) {
      throw error;
    }
  }

  public list = async (params: IListAuthParams): Promise<IPaginatedResponse> => {
    try {
      const errors = await validate(params);
      if (errors && errors.length) {
        return {
          status: false,
          validationErrors: errors
        };
      }

      const { page, limit } = params;
      const { data: total } = await this.total();
      const skip = this.paginationService.skip(page, limit);

      const where = {
        take: +limit,
        skip
      };

      const authList = await this.database.sqlManager.find(Auth, where);

      return {
        data: authList,
        status: true,
        pagination: {
          total,
          currentPage: +page
        }
      };
    } catch (error) {
      throw error;
    }
  }

  public create = async (params: ICreateAuthParams): Promise<IResponse> => {
    try {
      const { email, password, role} = params;

      // Validation
      const errors = await validate(params);
      if (errors && errors.length > 0) {
        return {
          validationErrors: errors,
          status: false
        };
      }

      const newRole = await this.database.sqlManager.findOne(Role, { id: role });
      if (!newRole) {
        return {
          validationErrors: [roleError],
          status: false
        };
      }

      // Create Auth
      const newAuth = new Auth();
      newAuth.email = email;
      newAuth.setPassword(password);
      newAuth.roles = [newRole];
      await this.database.sqlManager.save(newAuth);

      // Remove Password response
      newAuth.hashedPassword = '';

      return {
        data: newAuth,
        status: true
      };
    } catch (error) {
      throw error;
    }
  }

  public read = async (params: IReadAuthParams ): Promise<IResponse> => {
    try {
      const errors = await validate(params);
      if (errors && errors.length > 0) {
        return {
          validationErrors: errors,
          status: false
        };
      }
      const { userId } = params;
      const auth = await this.database.sqlManager.findOne(Auth, {
        where: { id: userId },
        relations: ['roles']
      });

      if (!auth) {
        return {
          status: false,
          data: null
        };
      }

      return {
        status: true,
        data: auth
      };
    } catch (error) {
      throw error;
    }
  }

  public update = async (params: IUpdateAuthParams): Promise<IResponse> => {
    const { id } = params;
    try {
      const errors = await validate(params);
      if (errors && errors.length > 0) {
        return {
          validationErrors: errors,
          status: false
        };
      }
      const auth = await this.database.sqlManager.findOne(Auth, {
        where: { id },
        relations: ['roles']
      });

      if (!auth) {
        return {
          validationErrors: [authError],
          status: false,
          data: null,
        };
      }

      // Update Auth
      auth.email = params.email;
      if (params.password) {
        auth.setPassword(params.password);
      }

      // Update Roles
      const isSameRole = auth.roles[0].id === params.role;
      if (!isSameRole) {
        const newRole = await this.database.sqlManager.findOne(Role, { id: params.role });
        if (!newRole) {
          return {
            validationErrors: [roleError],
            status: false,
            data: null
          };
        }
        auth.roles = [newRole];
      }

      // Execute Update
      await this.database.sqlManager.save(auth);
      return {
        data: auth,
        status: true
      };

    } catch (error) {
      throw error;
    }
  }

  public total = async (params?: any):Promise<IResponse> => {
    try {
      const total = await this.database.sqlManager.count(Auth);
      return {
        data: total,
        status: true
      };
    } catch (error) {
      throw error;
    }
  }

}
