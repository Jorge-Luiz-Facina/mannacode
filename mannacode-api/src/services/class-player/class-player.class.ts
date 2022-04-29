import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { IUsersMessage } from '../iusers/iusers.message';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';
import { formatDateServer } from '../../utils/date';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { IPlayerChallengesMessage } from '../iplayer-challenges/iplayer-challenges.message';

export class ClassPlayer extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.query?.token) {
      throwRuleException(IUsersMessage.autenticado);
    }
    if (!params.query || !params.query.page === undefined || !params.query.pageSize === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };

    const player = await this.app.service('authentication-player').get(params.query?.token, newParams);
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(newParams));

    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
      }
    })) as any;
    if (applicatorStartGroupChallenge.total === 0) {
      throwRuleException('Não há atividades');
    }
    const GroupChallengesId = applicatorStartGroupChallenge.data.map(item => item.groupChallengeId);
    const serviceGroupChallenges = this.app.service('igroup-challenges');
    const groupChallenges = await serviceGroupChallenges.find(acessExternal({
      query: {
        id: {
          $in: GroupChallengesId
        },
        type: GroupChallengeType.SOLO,
        status: {
          $or: [
            { $ne: StatusChallenges.END },
            null
          ],
        },
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        $sort: params.query?.$sort
      },
    })) as any;
    groupChallenges.classificationLength = applicatorStart.classificationLength;
    return groupChallenges;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {

    if (!data.token) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const newParams = { ...params, query: {} };
    const player = await this.app.service('authentication-player').get(data.token, newParams);

    if (!data.page === undefined || !data.pageSize === undefined || !data.groupChallengeId === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }

    const groupChallenge = await this.app.service('igroup-challenges').get(data.groupChallengeId, acessExternal(params));
    if (!groupChallenge || groupChallenge.type !== GroupChallengeType.SOLO || groupChallenge.status === StatusChallenges.END) {
      throwRuleException('Essa não é uma atividade valida');
    }
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
        groupChallengeId: data.groupChallengeId
      }
    })) as any;
    if (applicatorStartGroupChallenge.total < 1) {
      throwRuleException('Não existe essa atividade');
    }
    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: {
        groupChallengeId: data.groupChallengeId,
        $skip: (data.page - 1) * data.pageSize,
        $limit: data.pageSize,
        $sort: params.query?.$sort
      },
    })) as any;

    challenges.data.viewPlayersFinishedChallenge = groupChallenge.viewPlayersFinishedChallenge;
    const challengeIds = challenges.data.map(item => item.id);

    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        challengeId: {
          $in: challengeIds
        },
        playerStartId: player.idFk
      },
    })) as any;
    let i = 0;
    for (const challenge of challenges.data) {
      const playerChallenge = playerChallenges.data.find(item => item.challengeId === challenge.id);
      if (playerChallenge) {
        const date = formatDateServer();
        const validity = new Date(groupChallenge.validity);
        const endTime = new Date(playerChallenge.started);
        endTime.setMinutes(endTime.getMinutes() + challenge.time);
        challenges.data[i].finished = endTime < date || playerChallenge.passTest || validity < date;
      } else {
        challenges.data[i].finished = false;
      }
      i++;
    }

    return challenges;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params.query?.token) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const newParams = { ...params, query: {} };
    const challenge = await this.app.service('ichallenges').get(id, acessExternal(newParams));
    const player = await this.app.service('authentication-player').get(params.query?.token, newParams);

    const groupChallenge = await this.app.service('igroup-challenges').get(challenge.groupChallengeId, acessExternal(newParams));
    if (!groupChallenge || groupChallenge.type !== GroupChallengeType.SOLO || groupChallenge.status === StatusChallenges.END) {
      throwRuleException('Essa não é uma atividade valida');
    }
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
        groupChallengeId: challenge.groupChallengeId
      }
    })) as any;
    if (applicatorStartGroupChallenge.total < 1) {
      throwRuleException('Não existe essa atividade');
    }
    let playerChallenge = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk, challengeId: challenge.id,
      },
      paginate: false
    })) as any;
    let endTime;
    const date = formatDateServer();
    const validity = new Date(groupChallenge.validity);
    if (playerChallenge.length > 0) {
      playerChallenge = playerChallenge[0];
      delete playerChallenge[0];

      endTime = new Date(playerChallenge.started);
      endTime.setMinutes(endTime.getMinutes() + challenge.time);
      if (endTime < date || playerChallenge.passTest || validity < date) {
        const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find({
          query: {
            playerChallengeId: playerChallenge.id,
            playerStartPunctuatedId: player.idFk
          },
          paginate: false,
        }) as any;
        playerChallenge.punctuation = applicatorChallengePunctuations[0]?.punctuation;
      }
    } else {
      playerChallenge = await this.app.service('iplayer-challenges').create({
        code: '', errorLog: 'Iniciou o desafio', time: 0, passTest: false,
        punctuated: false, challengeId: challenge.id, started: new Date(), playerStartId: player.idFk
      }, acessExternal(newParams));
      endTime = new Date(playerChallenge.started);
      endTime.setMinutes(endTime.getMinutes() + challenge.time);
    }
    if (validity < date) {
      endTime = validity;
    }
    playerChallenge.challenge = challenge;
    playerChallenge.endTime = endTime;
    playerChallenge.name = player.name;
    return playerChallenge;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    if (!data.token) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const challenge = await this.app.service('ichallenges').get(id, acessExternal(params));
    const player = await this.app.service('authentication-player').get(data.token, params);
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
        groupChallengeId: challenge.groupChallengeId
      }
    })) as any;
    if (applicatorStartGroupChallenge.total < 1) {
      throwRuleException('Não existe essa atividade');
    }

    const groupChallenge = await this.app.service('igroup-challenges').get(challenge.groupChallengeId, acessExternal(params));
    if (!groupChallenge || groupChallenge.type !== GroupChallengeType.SOLO || groupChallenge.status === StatusChallenges.END) {
      throwRuleException('Essa não é uma atividade valida');
    }
    data.applicatorStartId = player.applicatorStartId;
    data.playerStartId = player.idFk;
    const result = await this.app.service('player-challenges').executeCode(data, challenge.test, params);
    const playerCode = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk, challengeId: challenge.id,
      },
      paginate: false
    })) as any;

    if (playerCode.length > 0) {
      const date = formatDateServer();
      const validity = new Date(groupChallenge.validity);
      let endTime = new Date(playerCode[0].started);
      endTime.setMinutes(endTime.getMinutes() + challenge.time);
      if (endTime < date || validity < date) {
        throwRuleException(IPlayerChallengesMessage.tempoAcabou);
      }
      if (playerCode[0].passTest) {
        return IPlayerChallengesMessage.finalizouDesafio;
      }
      await this.app.service('iplayer-challenges').patch(playerCode[0].id,
        {
          code: data.code,
          errorLog: result.output, time: 0, passTest: !result.tests[0].error
        }, acessExternal(params));
      return `[Enviado] ${result.output}`;
    }
    await this.app.service('iplayer-challenges').create(
      {
        errorLog: result.output, time: 0,
        passTest: !result.tests[0].error,
        challengeId: challenge.id,
      }, acessExternal(params));
    return `[Enviado] ${result.output}`;
  }
}