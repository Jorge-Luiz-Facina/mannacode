import { SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { BaseService } from '../base';

export class IPlayerChallenges extends BaseService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }
}
