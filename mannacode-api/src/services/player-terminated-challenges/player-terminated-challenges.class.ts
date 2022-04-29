import { SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { BaseService } from '../base';

export class PlayerTerminetedChallenges extends BaseService {
  private app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }
}
