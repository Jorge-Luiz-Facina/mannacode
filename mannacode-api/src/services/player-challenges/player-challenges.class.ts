import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { getRedis } from '../../utils/redist';
import { acessExternal } from '../../utils/acess-external';
import { formatDateServer } from '../../utils/date';
import { AdapterService } from '../adapter-service';
import { IUsersMessage } from '../iusers/iusers.message';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { IPlayerChallengesMessage } from '../iplayer-challenges/iplayer-challenges.message';

export class PlayerChallenges extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    if (!params.query || !params.query.page === undefined ||
      !params.query.pageSize === undefined || !params.query?.playerStartId === undefined
      || !params.query?.groupChallengeId === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };
    const groupChallenge = await this.app.service('group-challenges').get(params.query?.groupChallengeId, newParams);
    const player = await this.app.service('iplayer-start').get(params.query?.playerStartId, acessExternal(newParams));
    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        $sort: params.query?.$sort
      },
    })) as any;
    const challengesId = playerChallenges.data.map(item => item.challengeId);
    const challenges = await this.app.service('ichallenges').find(acessExternal({
      query: {
        id: {
          $in: challengesId
        },
      }
    })) as any;
    let i = 0;
    for (const playerChallenge of playerChallenges.data) {
      playerChallenges.data[i].challenge = challenges.data.find(item => item.id === playerChallenge.challengeId);
      let punctuationTotal = 0;
      if (groupChallenge.playerWeight !== 0) {
        const playerChallengePunctuations = await this.app.service('player-challenge-punctuations').find(acessExternal({
          query: {
            playerChallengeId: playerChallenge.id,
          },
          paginate: false
        })) as any;

        for (const _playerStart of playerChallengePunctuations) {
          punctuationTotal += _playerStart.punctuation * groupChallenge.playerWeight;
        }

      }

      if (groupChallenge.applicatorWeight !== 0) {
        const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
          query: {
            playerChallengeId: playerChallenge.id,
          },
          paginate: false
        })) as any;
        if (applicatorChallengePunctuations.length > 0) {
          punctuationTotal += applicatorChallengePunctuations[0].punctuation * groupChallenge.applicatorWeight;
        }
      }
      playerChallenge.punctuationTotal = punctuationTotal;
      i++;
    }

    return playerChallenges;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (data.time || data.punctuation || data.passTest || data.errorLog) {
      throwRuleException(IPlayerChallengesMessage.alterandoAlgumElementoErrado);
    }
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const cacheInfo = `info:${data.applicatorStartId}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    const infoJson = await getRedis(cacheClient, cacheInfo);
    const applicatorStart = JSON.parse(applicatorStartJson);
    const info = JSON.parse(infoJson);
    const playerTerminetedCount = await this.app.service('player-terminated-challenges').find({
      query: {
        applicatorStartId: data.applicatorStartId,
        challengeId: info.challengeId,
      }
    }) as any;
    const player = applicatorStart.players.find(item => item.keyOnline === data.playerStartId);
    if (!player) {
      throwRuleException(IPlayerChallengesMessage.naoPertenceAtividade);
    }
    const playerStart = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        id: player.id,
        status: StatusChallenges.INITIALIZED
      },
      paginate: false
    })) as any;

    if (playerStart.length === 0) {
      throwRuleException(IPlayerChallengesMessage.naoJogadorAtividade);
    }
    const dateNow = formatDateServer();
    const dateEnd = new Date(info.endTime);

    if (dateEnd < dateNow) {
      throwRuleException(IPlayerChallengesMessage.tempoAcabou);
    }
    const challenge = applicatorStart.challenges.find(item => item.id === info.challengeId);
    const time = Math.floor(Math.abs(dateNow.getTime() - new Date(info.startTime).getTime()) / 60);
    const playerCode = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk, challengeId: info.challengeId,
      },
      paginate: false
    })) as any;

    const result = await this.executeCode(data, challenge.test, params);
    if (playerCode.length > 0) {
      if (playerCode[0].passTest) {
        return IPlayerChallengesMessage.finalizouDesafio;
      }
      await this.app.service('iplayer-challenges').patch(playerCode[0].id,
        {
          ...playerCode[0], code: data.code,
          errorLog: result.output, time, passTest: !result.tests[0].error
        }, acessExternal(params));
      await this.app.service('status-players').create({ applicatorStartId: data.applicatorStartId });
      return `[Enviado]
${result.output}`;
    }
    await this.app.service('iplayer-challenges').create(
      {
        ...data, errorLog: result.output, time, playerStartId: player.idFk,
        passTest: !result.tests[0].error,
        challengeId: info.challengeId
      }, acessExternal(params));
    await this.app.service('player-terminated-challenges').create({
      applicatorStartId: data.applicatorStartId,
      challengeId: info.challengeId,
      playerStartId: player.idFk
    }, acessExternal(params));

    if ((playerTerminetedCount.data.length + 1) === info.playerCount) {
      await this.app.service('status-challenges').create({ applicatorStartId: data.applicatorStartId }, params);
    }
    await this.app.service('status-players').create({ applicatorStartId: data.applicatorStartId });
    return `[Enviado]
${result.output}`;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const newParams = { ...params, query: {} };
    const playerChallenge = await this.app.service('iplayer-challenges').get(id, acessExternal(newParams));
    let playerStart = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: playerChallenge.playerStartId
      },
      paginate: false
    })) as any;
    playerStart = playerStart[0];
    const groupChallenge = await this.app.service('group-challenges').get(params.query?.groupChallengeId, newParams);

    const challenge = await this.app.service('ichallenges').get(playerChallenge.challengeId, acessExternal(newParams));
    if (groupChallenge.playerWeight !== 0) {
      const playerChallengePunctuations = await this.app.service('player-challenge-punctuations').find(acessExternal({
        query: {
          playerChallengeId: id,
        },
        paginate: false
      })) as any;

      let i = 0;
      for (const _playerStart of playerChallengePunctuations) {
        const player = await this.app.service('iplayer-start').find(acessExternal({
          query: {
            idFk: _playerStart.playerStartId
          },
          paginate: false
        })) as any;
        
        playerChallengePunctuations[i].name = player[0]!.name;
        i++;
      }
      playerChallenge.players = playerChallengePunctuations;
    }

    if (groupChallenge.applicatorWeight !== 0) {
      const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
        query: {
          playerChallengeId: id,
        },
        paginate: false
      })) as any;
      playerChallenge.applicator = applicatorChallengePunctuations[0];
    }

    playerChallenge.playerWeight = groupChallenge.playerWeight;
    playerChallenge.applicatorWeight = groupChallenge.applicatorWeight;
    playerChallenge.challenge = challenge;
    playerChallenge.name = playerStart.name;
    return playerChallenge;
  }

  public async executeCode(data, test, params) {
    const result = await this.app.service('code-executor').create({
      code: data.code, test: test,
      language: data.language,
      playerId: data.playerStartId,
      applicatorStartId: data.applicatorStartId
    }, acessExternal(params));
    result.output = await this.app.service('code-executor').getOutput(result.tests[0], data.language, data.code);
    return result;
  }
}
