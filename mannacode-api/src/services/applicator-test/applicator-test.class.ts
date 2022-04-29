import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { AdapterService } from '../adapter-service';
import { IUsersMessage } from '../iusers/iusers.message';

export class ApplicatorTest extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    await this.app.service('group-challenges').get(data.groupChallengeId, params);

    const result = await this.app.service('code-executor').create({
      code: data.code, test: data.test,
      language: data.language,
      playerId: params.user?.idFk,
      applicatorStartId: params.user?.idFk,
    }, acessExternal(params));
    return this.app.service('code-executor').getOutput(result.tests[0], data.language, data.code);
  }
}