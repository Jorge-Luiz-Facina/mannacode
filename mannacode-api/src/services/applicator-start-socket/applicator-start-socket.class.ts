import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { acessExternal } from '../../utils/acess-external';
import { AdapterService } from '../adapter-service';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { formatDateServer } from '../../utils/date';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';
import { IGroupChallengesMessage } from '../igroup-challenges/igroup-challenges.message';
import { generateKey } from '../../utils/generate';

export class ApplicatorStartSocket extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const applicatorStart = await this.app.service('iapplicator-start').find(acessExternal(params)) as any;
    if (applicatorStart.total > 1) {
      throwRuleException(IApplicatorStartMessage.encontradoMaisDeUmIniciado);
    }
    if (applicatorStart.total < 1) {
      return {};
    }
    const newParams = { ...params, query: {} };
    await this.app.service('group-challenges').get(applicatorStart.data[0].groupChallengeId, acessExternal(newParams));

    return applicatorStart.data[0];
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {

    const groupChallenge = await this.app.service('group-challenges').get(data.groupChallengeId, params);
    if(groupChallenge.mode !== GroupChallengeType.MULTIPLAYER){
      throwRuleException(IGroupChallengesMessage.naoIniciarModoSoloComMutiplayer);
    }
    delete groupChallenge.createdAt;
    delete groupChallenge.updatedAt;
    delete groupChallenge.deletedAt;

    const plan = await this.app.service('plans').get(params.user?.idFk, params);
    if (plan.validity < formatDateServer()) {
      throwRuleException(IUsersMessage.planoExpirou);
    }
    const existingApplicatorNotFinalized = await this.app.service('igroup-challenges').find(acessExternal({
      query: {
        status: {
          $ne: StatusChallenges.END
        },
        type: GroupChallengeType.MULTIPLAYER
      }, paginate: false
    })) as any;
    if (existingApplicatorNotFinalized.length > 0) {
      throwRuleException(IApplicatorStartMessage.existemAtividadesFinalizadas);
    }
    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: { groupChallengeId: data.groupChallengeId },
    })) as any;

    if (challenges.total === 0) {
      throwRuleException(IApplicatorStartMessage.vocePrecisaTerPeloMenosUmDesafio);
    }

    let key = generateKey(6);

    let existingApplicatorStart = await this.app.service('iapplicator-start').find({
      query: { key }, paginate: false
    }) as any;

    while (existingApplicatorStart.length > 0) {
      key = generateKey(6);
      existingApplicatorStart = this.app.service('iapplicator-start').find({
        query: { key }, paginate: false
      }) as any;
    }

    const groupChallengeStart = await this.app.service('igroup-challenges').create({ ...groupChallenge, id: undefined, type: GroupChallengeType.MULTIPLAYER, mode: GroupChallengeType.MULTIPLAYER }, acessExternal(params));
    for (let challenge of challenges.data) {
      await this.app.service('ichallenges').create({ ...challenge, id: undefined, groupChallengeId: groupChallengeStart.id }, acessExternal(params));
    }
    if (data.applicatorStartId) {
      const applicatorStart = await this.app.service('applicator-start').get(data.applicatorStartId, params) as any;
      await this.app.service('applicator-start-group-challenge').create({ applicatorStartId: applicatorStart.id, groupChallengeId: groupChallengeStart.id }, acessExternal(params));
      return await this.app.service('iapplicator-start').patch(applicatorStart.id, { status: StatusChallenges.INITIAL }, acessExternal(params));
    }
    else {
      const applicatorStart = await this.app.service('iapplicator-start').create({ name: 'Padrão multiplayer', type: ApplicatorStartType.ROOM_MULTIPLAYER, key: key, status: StatusChallenges.INITIAL, userId: params.user?.idFk }, acessExternal(params));
      await this.app.service('applicator-start-group-challenge').create({ applicatorStartId: applicatorStart.id, groupChallengeId: groupChallengeStart.id }, acessExternal(params));
      return { ...applicatorStart, groupChallengeId: groupChallengeStart.id };
    }
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    return await this.app.service('applicator-start').get(id, params);
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    await this.app.service('applicator-start').get(id, params);

    await this.app.service('status-players').create({ applicatorStartId: id });
    return await this.app.service('status-challenges').create(
      { applicatorStartId: id });
  }
}
