import { Application } from '../../declarations';
import { BaseService } from '../base';
import { SequelizeServiceOptions } from 'feathers-sequelize/types';


export class ApplicatorStartGroupChallenge extends BaseService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}