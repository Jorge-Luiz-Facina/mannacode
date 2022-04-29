import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { IGroupChallengesMessage } from '../igroup-challenges/igroup-challenges.message';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { BaseValidate } from '../../utils/validate/base.validate';
import { RequiredField } from '../../utils/validate/required-field';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';

export class Challenges extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    if (!params.query || !params.query.page === undefined || !params.query.pageSize === undefined || !params.query?.groupChallengeId === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };
    await this.app.service('group-challenges').get(params.query?.groupChallengeId, newParams);

    const challenges = this.app.service('ichallenges');
    return await challenges.find(acessExternal({
      query: {
        groupChallengeId: params.query?.groupChallengeId,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        $sort: params.query?.$sort
      },
    })) as any;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const serviceChalleneges = this.app.service('ichallenges');

    this.validate(data);
    const groupChallenges = await this.app.service('group-challenges-one-to-many').get(data.groupChallengeId, acessExternal(params));
    const existingChallenge = await serviceChalleneges.find({
      query: {
        groupChallengeId: data.groupChallengeId,
        title: data.title
      },
      paginate: false
    }) as any;

    if (existingChallenge.length > 0) {
      throwRuleException(IGroupChallengesMessage.jaCadastrado);
    }
    data.index = groupChallenges.challenges.length + 1;
    return await serviceChalleneges.create(data, acessExternal(params));
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const challenge = await this.app.service('ichallenges').get(id, acessExternal(params));
    await this.app.service('group-challenges').get(challenge.groupChallengeId, params);
    return challenge;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    if (data.groupChallengeId) {
      throwRuleException(IGroupChallengesMessage.naoAlterarGrupoId);
    }
    if(data.index){
      return this.app.service('ichallenges').patch(id, { index: data.index }, acessExternal(params));
    }
    this.validate(data);
    return this.app.service('ichallenges').patch(id, data, acessExternal(params));
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    return this.app.service('ichallenges').remove(id, acessExternal(params));
  }

  private validate(data: Partial<any>): void {
    const validates: BaseValidate[] = [new RequiredField({ value: data.title, name: 'título' }), new RequiredField({ value: data.code, name: 'Solução' }),
      new RequiredField({ value: data.test, name: 'testes' }), new RequiredField({ value: data.time, name: 'tempo' }), new RequiredField({ value: data.description, name: 'instrução' }),
      new RequiredField({ value: data.language, name: 'linguagem' })];

    for (const validate of validates) {
      if (validate.verifyField()) {
        validate.action();
      }
    }
  }
}
