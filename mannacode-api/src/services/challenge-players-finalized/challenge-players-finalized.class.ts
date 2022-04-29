import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';
import { formatDateServer } from '../../utils/date';
import { PlayerStartStatus } from '../../models/enums/status-player-start';

export class challengePlayersFinalized extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.query?.token) {
      throwRuleException('Você não esta autenticado. Faça Login');
    }
    const newParams = { ...params, query: {} };

    const player = await this.app.service('authentication-player').get(params.query?.token, newParams);
    const challenge = await this.app.service('ichallenges').get(params.query?.challengeId, acessExternal(newParams));
    const groupChallenge = await this.app.service('igroup-challenges').get(challenge.groupChallengeId, acessExternal(newParams));

    if (!groupChallenge.viewPlayersFinishedChallenge) {
      throwRuleException('Essa atividade não permite visualizar resposta de outros jogadores');
    }
    const playerChallenge = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk,
        challengeId: challenge.id,
      },
      paginate: false
    })) as any;
    const date = formatDateServer();
    const validity = new Date(groupChallenge.validity);
    const endTime = new Date(playerChallenge[0].started);
    endTime.setMinutes(endTime.getMinutes() + challenge.time);
    if (!(endTime < date || playerChallenge[0].passTest || validity < date)) {
      throwRuleException('Você não pode acessar as respostas dos jogadres ainda');
    }
    const challenges = this.app.service('iplayer-challenges');
    const playerChallenges = await challenges.find(acessExternal({
      query: {
        challengeId: params.query?.challengeId,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        passTest: true
      },
    })) as any;

    const playerIds = playerChallenges.data.map(item => item.playerStartId);

    const players = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: {
          $in: playerIds
        },
        status: {
          $or: [
            { $ne: PlayerStartStatus.END },
            null
          ],
        },
      },
    })) as any;
    players.data.forEach(function (item) { delete item.key; });
    return players;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    let applicatorStartId;
    if (data.token) {
      if (!data.token) {
        throwRuleException('Você não esta autenticado. Faça Login');
      }
      const player = await this.app.service('authentication-player').get(data.token, params);
      applicatorStartId = player.applicatorStartId;
      const applicatorStartGroupchallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
        query: {
          groupChallengeId: data.groupChallengeId,
          applicatorStartId: player.applicatorStartId
        },
      })) as any;
      if (applicatorStartGroupchallenge.data.total === 0) {
        throwRuleException('Você não pertence a essa atividade');
      }
    } else {
      await this.app.service('group-challenges').get(data.groupChallengeId, params);
      const applicatorStartGroupchallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
        query: {
          groupChallengeId: data.groupChallengeId,
        },
      })) as any;
      if (applicatorStartGroupchallenge.data.total === 0) {
        throwRuleException('Você não pertence a essa atividade');
      }
      applicatorStartId = applicatorStartGroupchallenge.data[0].applicatorStartId;
    }

    const groupChallenge = await this.app.service('igroup-challenges').get(data.groupChallengeId, acessExternal(params));
    if (groupChallenge.classificationLength !== null && groupChallenge.classificationLength === 0) {
      throwRuleException('Essa atividade não tem classsificação');
    }

    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: {
        groupChallengeId: data.groupChallengeId
      }
    })) as any;
    const challengeIds = challenges.data.map(item => item.id);
    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        challengeId: {
          $in: challengeIds
        },
      },
    })) as any;

    const playerChallengeIds = playerChallenges.data.map(item => item.id);
    const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerChallengeId: {
          $in: playerChallengeIds
        },
      },
    })) as any;
    const plan = await this.app.service('iplans').find({
      query: { userId: groupChallenge.userId, active: true },
    }) as any;

    const players = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        $limit: plan.data[0].numberPlayers,
        applicatorStartId: applicatorStartId,
        status: {
          $or: [
            { $ne: PlayerStartStatus.END },
            null
          ],
        },
      }
    })) as any;
    let i = 0;
    for (const _player of players.data) {
      let punctuation = 0;
      for (const punctuationPlayer of applicatorChallengePunctuations.data) {
        if (_player.idFk === punctuationPlayer.playerStartPunctuatedId) {
          punctuation += punctuationPlayer.punctuation;
        }
      }
      players.data[i].punctuation = punctuation;
      i++;
    }
    players.data.sort((a, b) => (a.punctuation < b.punctuation) ? 1 : -1);

    const limit = (groupChallenge.classificationLength && (data.pageSize * data.page) > groupChallenge.classificationLength) ? groupChallenge.classificationLength : data.pageSize * data.page;
    players.data = players.data.slice((data.page - 1) * data.pageSize, limit);
    if (groupChallenge.classificationLength) {
      players.total = groupChallenge.classificationLength;
    }
    players.data.forEach(function (item) { delete item.key; });
    return players;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const player = await this.app.service('authentication-player').get(id, params);
    const playerPunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerStartPunctuatedId: player.idFk
      }
    })) as any;
    let punctuationTotal = 0;
    for (const item of playerPunctuations.data) {
      punctuationTotal += item.punctuation;
    }
    return { punctuationTotal };
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {

    if (!id) {
      throwRuleException('Você não esta autenticado. Faça Login');
    }
    const player = await this.app.service('authentication-player').get(id, params);
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(params));
    if (applicatorStart.classificationLength !== null && applicatorStart.classificationLength === 0) {
      throwRuleException('Essa turma não tem classsificação');
    }
    const plan = await this.app.service('iplans').find({
      query: { userId: applicatorStart.userId, active: true },
    }) as any;
    const playerStart = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
        $limit: plan.data[0].numberPlayers,
        status: {
          $or: [
            { $ne: PlayerStartStatus.END },
            null
          ],
        },
      },
    })) as any;
    let i = 0;
    for (const player of playerStart.data) {
      const playerPunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
        query: {
          playerStartPunctuatedId: player.idFk
        }
      })) as any;
      let punctuationTotal = 0;
      for (const item of playerPunctuations.data) {
        punctuationTotal += item.punctuation ? item.punctuation : 0;
      }
      playerStart.data[i].punctuationTotal = punctuationTotal;
      i++;
    }
    playerStart.data.sort((a, b) => (a.punctuationTotal < b.punctuationTotal) ? 1 : -1);
    const limit = (applicatorStart.classificationLength && (data.pageSize * data.page) > applicatorStart.classificationLength) ? applicatorStart.classificationLength : data.pageSize * data.page;

    playerStart.data = playerStart.data.slice((data?.page - 1) * data?.pageSize, limit);
    if (applicatorStart.classificationLength) {
      playerStart.total = applicatorStart.classificationLength;
    }
    playerStart.data.forEach(function (item) { delete item.key; });
    return playerStart;
  }

}
