import { Service } from 'typedi';
import { BaseService } from '../../core/base-service';

@Service()
export class CommonService extends BaseService {

  public getFilePath = (files: Express.Multer.File | Express.Multer.File[]) => {
    const destination = (files as Express.Multer.File).destination;
    const name = (files as Express.Multer.File).filename;
    return `${destination}/${name}`;
  }

}
