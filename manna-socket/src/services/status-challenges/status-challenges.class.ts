import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';

export class StatusChallenge extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    await this.permission(data.user);
    delete data.user;
    delete data.__proto__;
    return data
  }

  public permission(data) {
    const user = this.app.get('user');
    if (user.login !== data.login || user.password !== data.password) {
      throwRuleException('Não tem permissão para usar o serviço');
    }
  }
}