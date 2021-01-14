import { Service } from 'typedi';
import { Database } from '../../common/components/database/database';
import { IPaginatedResponse, IResponse } from '../../common/dtos/response.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { BaseService } from '../../core/base-service';
import { IListRolesParams } from './role.dto';
import { Role } from './role.entity';

@Service()
export class RoleService extends BaseService {

  constructor(
    database: Database,
    private paginationService: PaginationService
  ) {
    super(database);
  }

  public list = async (params: IListRolesParams): Promise<IResponse<Role[]> | IPaginatedResponse<Role[]>> => {
    if (params.limit && params.page) {
      return this.paginatedList(params);
    }
    const roles = await this.database.sqlManager.find(Role);
    return {
      data: roles,
      status: true
    };
  }

  public paginatedList = async (params: IListRolesParams): Promise<IPaginatedResponse<Role[]>> => {
    const { page, limit } = params;
    const total = await this.total();
    const roles = await this.database.sqlManager.find(Role, {
      skip: this.paginationService.skip(page, limit),
      take: limit
    });
    return {
      data: roles,
      status: true,
      pagination: {
        currentPage: page,
        total
      }
    };
  }

  public total = async () => {
    const count = await this.database.sqlManager.count(Role);
    return count;
  }

}
