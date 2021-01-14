import { Service } from 'typedi';
import { BaseService } from '../../core/base-service';

@Service()
export class DateService extends BaseService {

  public toUTC = (date: any) => {
    return new Date(date).getUTCDate();
  }

}
