import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { acessExternal } from '../../utils/acess-external';
import { getDateEnd } from '../../utils/date';
import { formatDateServer } from '../../utils/date';
import { setRedis } from '../../utils/redist';
import { AdapterService } from '../adapter-service';
import { PlayerStartStatus } from '../../models/enums/status-player-start';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';

export class ApplicatorStart extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const newParams = { ...params, query: { ...params.query, userId: params.user?.idFk } };
    const applicatorStart = await this.app.service('iapplicator-start').find(acessExternal(newParams)) as any;

    return applicatorStart;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    if (!data.groupChallengeId) {
      throwRuleException(IApplicatorStartMessage.semReferenciaAtividade);
    }
    const groupChallenge = await this.app.service('group-challenges').get(data.groupChallengeId, params);
    delete groupChallenge.createdAt;
    delete groupChallenge.updatedAt;
    delete groupChallenge.deletedAt;
    if (groupChallenge.mode !== GroupChallengeType.SOLO) {
      throwRuleException(IApplicatorStartMessage.atividadeDeveEstarSolo);
    }
    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: { groupChallengeId: data.groupChallengeId },
    })) as any;

    if (challenges.total === 0) {
      throwRuleException(IApplicatorStartMessage.vocePrecisaTerPeloMenosUmDesafio);
    }
    if (groupChallenge.mode === GroupChallengeType.SOLO && new Date(groupChallenge.validity) < formatDateServer()) {
      throwRuleException(IApplicatorStartMessage.altereValidadeAtividade);
    }
    const groupChallengeStart = await this.app.service('igroup-challenges').create({ ...groupChallenge, id: undefined, type: GroupChallengeType.SOLO, mode: GroupChallengeType.SOLO }, acessExternal(params));
    for (let challenge of challenges.data) {
      await this.app.service('ichallenges').create({ ...challenge, id: undefined, groupChallengeId: groupChallengeStart.id }, acessExternal(params));
    }
    for (let applicatorStart of data.applicatorStarts) {
      const applicator = await this.get(applicatorStart, params);
      if (applicator.type !== ApplicatorStartType.ROOM_SOLO) {
        throwRuleException(IApplicatorStartMessage.naoAdicionarAtividadeTipoSolo);
      }
    }
    for (let applicatorStart of data.applicatorStarts) {
      await this.app.service('applicator-start-group-challenge').create({ applicatorStartId: applicatorStart, groupChallengeId: groupChallengeStart.id }, acessExternal(params));
    }
    return 'sucess';
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const applicatorStart = await this.app.service('iapplicator-start').get(id, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    return applicatorStart;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {

    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const newParamsQuery = {
      ...params,
      query: {
        applicatorStartId: id,
        status: PlayerStartStatus.INITIAL
      }
    };
    const playerStart = await this.app.service('iplayer-start').find(acessExternal(newParamsQuery)) as any;
    playerStart.data.forEach(function (item) { delete item.key; });

    const plan = await this.app.service('plans').get(params.user?.idFk, params);
    if (plan.numberPlayers < playerStart.data.length) {
      throwRuleException(`Limite de ${plan.numberPlayers} atual de ${playerStart.data.length}`);
    }
    for (const row of playerStart.data) {
      await this.app.service('iplayer-start').patch(row.id,
        { status: PlayerStartStatus.INITIALIZED }, acessExternal(params));
    }

    const cacheClient = this.app.get('redis');
    const applicatorStart = await this.get(id, params);

    if (applicatorStart.status === StatusChallenges.INITIALIZED) {
      throwRuleException(IApplicatorStartMessage.atividadeJaInicializada);
    }
    const groupChallenge = await this.app.service('group-challenges').get(data.groupChallengeId, acessExternal(params));

    delete groupChallenge.createdAt;
    delete groupChallenge.updatedAt;
    delete groupChallenge.deletedAt;

    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: { groupChallengeId: groupChallenge.id },
    })) as any;

    groupChallenge.players = playerStart.data.map(player => {
      return {
        id: player.id,
        name: player.name,
        keyOnline: player.keyOnline,
        idFk: player.idFk
      };
    });
    groupChallenge.challenges = challenges.data.map(challenge => {
      return {
        id: challenge.id,
        index: challenge.index,
        title: challenge.title,
        description: challenge.description,
        language: challenge.language,
        test: challenge.test,
        time: challenge.time
      };
    });

    if (challenges.total === 0) {
      throwRuleException(IApplicatorStartMessage.vocePrecisaTerPeloMenosUmDesafio);
    }

    if (groupChallenge.players.length === 0) {
      throwRuleException(IApplicatorStartMessage.paraContinuarAtividadeConterPeloMenosUmDesafio);
    }

    const cacheApplicatorStart = `applicator-start:${id}`;
    setRedis(cacheClient, cacheApplicatorStart, groupChallenge);

    const firstChallenge = challenges.data.find(item => item.index === 1);
    const endTime = getDateEnd(firstChallenge.time);
    const cacheInfo = `info:${id}`;
    const info = { playerCount: playerStart.data.length, challengeId: firstChallenge.id, startTime: formatDateServer(), endTime };
    setRedis(cacheClient, cacheInfo, info);
    await this.app.service('status-challenges').create({ applicatorStartId: id }, params);
    return this.app.service('iapplicator-start').patch(id,
      {
        key: '',
        status: StatusChallenges.INITIALIZED
      }, acessExternal(params));
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    await this.app.service('applicator-start').get(id, acessExternal(params)) as any;

    return await this.app.service('iapplicator-start').remove(id, acessExternal(params)) as any;
  }

}