import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { acessExternal } from '../../utils/acess-external';

export class GroupChallengesOneToMany extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    return await this.app.service('igroup-challenges').find(params);
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    return await this.app.service('igroup-challenges').create(data, params);
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params || !params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const serviceGroupChallenges = this.app.service('igroup-challenges');

    const groupChallenge = await serviceGroupChallenges.get(id, acessExternal(params));
    if (groupChallenge.userId !== params.user!.idFk) {
      throwRuleException('Você não tem permissão para fazer a ação');
    }

    return groupChallenge;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {

    if (!params || !params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const serviceGroupChallenges = this.app.service('igroup-challenges');

    const groupChallenge = await serviceGroupChallenges.get(id, acessExternal(params));
    if (groupChallenge.userId !== params.user!.idFk) {
      throwRuleException('Você não tem permissão para fazer a ação');
    }
    const challengesService = this.app.service('ichallenges');
    for (let item of data.challenges) {
      await challengesService.patch(item.id, item, acessExternal(params));
    }
    return await serviceGroupChallenges.patch(id, data, acessExternal(params));
  }
}
