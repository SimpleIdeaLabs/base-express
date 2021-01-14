import { Service } from 'typedi';
import { Account } from './account.entity';
import { BaseService } from '../../core/base-service';
import { ICreateAccountParams, IListAccountParams, ILoginParams, IReadAccountParams, IUpdateAccountParams } from './account.dto';
import { validate } from 'class-validator';
import { IPaginatedResponse, IResponse } from '../../common/dtos/response.dto';
import { accountError, loginError, roleError } from './account.errors';
import { Role } from '../roles/role.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { Database } from '../../common/components/database/database';

@Service()
export class AccountService extends BaseService {

  constructor(
    private paginationService: PaginationService,
    public database: Database
  ) {
    super(database);
  }

  public login = async (params: ILoginParams): Promise<IResponse<{ token: string }>> => {
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
    const account = await this.database.sqlManager.findOne(Account, {
      where: {
        email
      },
      relations: ['roles']
    });
    if (!account || (account && !account.checkPassword(password))) {
      return {
        validationErrors: [loginError],
        status: false
      };
    }

    return {
      data: {
        token: await account.toJWT()
      },
      status: true
    };
  }

  public list = async (params: IListAccountParams): Promise<IPaginatedResponse<Account[]>> => {
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

    const accountList = await this.database.sqlManager.find(Account, where);

    return {
      data: accountList,
      status: true,
      pagination: {
        total,
        currentPage: +page
      }
    };
  }

  public create = async (params: ICreateAccountParams, currentUser: Account): Promise<IResponse<Account>> => {
    const { email, password, role } = params;
    const { id: currentUserId } = currentUser;

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

    // Create Account
    const newAccount = new Account();
    newAccount.email = email;
    newAccount.setPassword(password);
    newAccount.roles = [newRole];
    newAccount.createdById = currentUserId;
    newAccount.updatedById = currentUserId;
    await this.database.sqlManager.save(newAccount);

    // Remove Password response
    newAccount.hashedPassword = '';

    return {
      data: newAccount,
      status: true
    };
  }

  public read = async (params: IReadAccountParams): Promise<IResponse<Account | null>> => {
    const errors = await validate(params);
    if (errors && errors.length > 0) {
      return {
        validationErrors: errors,
        status: false
      };
    }
    const { userId } = params;
    const account = await this.database.sqlManager.findOne(Account, {
      where: { id: userId },
      relations: ['roles']
    });

    if (!account) {
      return {
        status: false,
        data: null
      };
    }

    // Remove hashed password
    account.hashedPassword = '';

    return {
      status: true,
      data: account
    };
  }

  public update = async (params: IUpdateAccountParams, currentUser: Account): Promise<IResponse<Account | null>> => {
    const { id } = params;
    const { id: currentUserId } = currentUser;
    const errors = await validate(params);
    if (errors && errors.length > 0) {
      return {
        validationErrors: errors,
        status: false
      };
    }
    const account = await this.database.sqlManager.findOne(Account, {
      where: { id },
      relations: ['roles']
    });

    if (!account) {
      return {
        validationErrors: [accountError],
        status: false,
        data: null,
      };
    }

    // Update Account
    account.email = params.email;
    if (params.password) {
      account.setPassword(params.password);
    }

    // Update Roles
    const isSameRole = account.roles[0].id === params.role;
    if (!isSameRole) {
      const newRole = await this.database.sqlManager.findOne(Role, { id: params.role });
      if (!newRole) {
        return {
          validationErrors: [roleError],
          status: false,
          data: null
        };
      }
      account.roles = [newRole];
    }

    // Execute Update
    account.updatedById = currentUserId;
    await this.database.sqlManager.save(account);
    return {
      data: account,
      status: true
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public total = async (params?: any): Promise<IResponse<number>> => {
    const total = await this.database.sqlManager.count(Account);
    return {
      data: total,
      status: true
    };
  }

}
