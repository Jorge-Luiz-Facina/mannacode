import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { IGroupChallengesMessage } from '../igroup-challenges/igroup-challenges.message';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { ScoreEvaluation } from '../../models/enums/score_evaluation.enum';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';
import { RequiredField } from '../../utils/validate/required-field';
import { BaseValidate } from '../../utils/validate/base.validate';
import { Type } from '../../utils/validate/type.validate';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';
import { formatDateServer } from '../../utils/date';

export class GroupChallenges extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    if (!params.query || !params.query.page === undefined || !params.query.pageSize === undefined || !params.query.type) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const serviceGroupChallenges = this.app.service('igroup-challenges');
    return await serviceGroupChallenges.find(acessExternal({
      query: {
        userId: params.user?.idFk,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        type: params.query?.type,
        $sort: params.query?.$sort
      },
    })) as any;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    this.validate(data);
    const serviceGroupChallenges = this.app.service('igroup-challenges');

    const existingGroupChallenge = await serviceGroupChallenges.find({
      query: {
        userId: params.user!.idFk,
        title: data.title
      },
      paginate: false
    }) as any;

    if (existingGroupChallenge.length > 0) {
      throwRuleException(IGroupChallengesMessage.jaCadastrado);
    }
    const newData = {
      ...data, userId: params.user!.idFk, viewCodeName: true, classificationLength: null,
      scoreEvaluation: ScoreEvaluation.ALL, applicatorWeight: 10, playerWeight: 10, timePlayerWeight: 0,
      type: GroupChallengeType.GENERAL, mode: GroupChallengeType.MULTIPLAYER
    };
    return await serviceGroupChallenges.create(newData, acessExternal(params));
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params || !params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const serviceGroupChallenges = this.app.service('igroup-challenges');

    const groupChallenge = await serviceGroupChallenges.get(id, acessExternal(params));
    if (groupChallenge.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoAtividade);
    }
    return groupChallenge;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    if (data.userId) {
      throwRuleException(IGroupChallengesMessage.naoAlterarUserId);
    }
    if (data.type) {
      throwRuleException('Não pode alterar o tipo da atividade');
    }
    this.validateAll(data);
    if (data.classificationLength && data.classificationLength < 0) {
      throwRuleException('Classificação inválida número negativo');
    }
    if (!data.classificationLength && data.classificationLength !== 0) {
      data.classificationLength = null;
    }
    if (data.timeChallenge) {
      data.timePlayerWeight = 0;
    }
    if (data.scoreEvaluation === ScoreEvaluation.PLAYER) {
      data.applicatorWeight = 0;
      data.playerWeight = 10;
    }
    if (data.scoreEvaluation === ScoreEvaluation.TEACHER) {
      data.applicatorWeight = 10;
      data.playerWeight = 0;
    }
    if (data.mode === GroupChallengeType.SOLO && new Date(data.validity) < formatDateServer()) {
      throwRuleException('A data tem que ser maior do que o presente');
    }
    const serviceGroupChallenges = this.app.service('igroup-challenges');

    return serviceGroupChallenges.patch(id, data, acessExternal(params));
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    return this.app.service('igroup-challenges').remove(id, acessExternal(params));
  }

  private validate(data: Partial<any>): void {
    const validates: BaseValidate[] = [new RequiredField({ value: data.title, name: 'título' }), new RequiredField({ value: data.description, name: 'Descrição' })];

    for (const validate of validates) {
      if (validate.verifyField()) {
        validate.action();
      }
    }
  }

  private validateAll(data: Partial<any>): void {
    const validates: BaseValidate[] = [new RequiredField({ value: data.title, name: 'título' }), new RequiredField({ value: data.description, name: 'Descrição' }),
      new Type({ value: data.scoreEvaluation, types: [ScoreEvaluation.ALL, ScoreEvaluation.PLAYER, ScoreEvaluation.TEACHER] })];

    for (const validate of validates) {
      if (validate.verifyField()) {
        validate.action();
      }
    }
  }
}