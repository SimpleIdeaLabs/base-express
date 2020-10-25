import { Service } from 'typedi';
import { BaseService } from '../../core/base-service';

@Service()
export class PaginationService extends BaseService {

  public skip = (page: number, limit: number): number => {
    const skip = +limit * +page;
    return skip;
  }

}
