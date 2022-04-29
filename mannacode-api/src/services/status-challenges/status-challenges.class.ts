import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { getRedis, setRedis } from '../../utils/redist';
import { throwRuleException } from '../../utils/exception';
import { formatDateServer } from '../../utils/date';
import { acessExternal } from '../../utils/acess-external';
import { authenticateSocket } from '../../utils/authenticate-socket';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { StatusChallengesMessage } from './status-challenges.message';
import axios from 'axios';

export class StatusChallenge extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const statusChallenges = await this.getStatusChallenge(data);
    const mannasocket = this.app.get('mannasocket');
    const newData = { ...statusChallenges, user: { login: mannasocket.login, password: mannasocket.password } };

    await axios({
      method: 'post',
      url: `${mannasocket.host}/status-challenges`,
      data: newData
    }
    ).catch(function (error) {
      if (error.response) {
        throwRuleException(error.response.data.message);
      } else if (error.request) {
        throwRuleException(error.request);
      } else {
        throwRuleException(error.request);
      }
    });

    return statusChallenges;
  }

  public async getStatusChallenge(data) {
    const cacheClient = this.app.get('redis');
    const cacheInfo = `info:${data.applicatorStartId}`;
    const infoJson = await getRedis(cacheClient, cacheInfo);
    if (infoJson === null) {
      const applicatorStart = await this.app.service('iapplicator-start').get(data.applicatorStartId, acessExternal({}));
      if (applicatorStart.status === StatusChallenges.END) {
        return { applicatorStartId: data.applicatorStartId, status: StatusChallenges.END };
      }
      return { applicatorStartId: data.applicatorStartId, status: StatusChallenges.INITIAL };
    }
    const info = JSON.parse(infoJson);

    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    if (applicatorStartJson === null) {
      throwRuleException(StatusChallengesMessage.naoExisteMaisSala);
    }
    const applicatorStart = JSON.parse(applicatorStartJson);
    if (await this.getStatus(data) === StatusChallenges.EXECUTION) {
      return { ...info, applicatorStartId: data.applicatorStartId, status: StatusChallenges.EXECUTION, challenge: applicatorStart.challenges.find(challenge => challenge.id === info.challengeId) };
    }

    if (await this.getStatus(data) === StatusChallenges.SCORE) {
      const existPunctuations = applicatorStart?.punctuations?.find(punctuation => punctuation.challengeId === info.challengeId);
      const challengeActual = applicatorStart.challenges.find(item => item.id === info.challengeId);
      const challengeNext = applicatorStart.challenges.find(item => item.index === challengeActual.index + 1);
      const toFinish = challengeNext ? false : true;
      if (!!applicatorStart.punctuations && existPunctuations) {
        return { ...info, applicatorStartId: data.applicatorStartId, status: StatusChallenges.SCORE, punctuations: this.getPunctuations(applicatorStart), toFinish };
      }
      const playerChallengesPunctuated = await this.app.service('iplayer-challenges').find(acessExternal({
        query: {
          challengeId: info.challengeId,
          punctuated: true,
        }
      })) as any;
      const playerChallengesPunctuatedId = playerChallengesPunctuated.data.map(item => item.id);
      if (!!applicatorStart.applicatorWeight && applicatorStart.applicatorWeight > 0) {
        const applicatorChallengePunctuation = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
          query: {
            playerChallengeId: {
              $in: playerChallengesPunctuatedId
            },
          }
        })) as any;
        let i = 0;
        for (const playerChallenge of playerChallengesPunctuated.data) {
          const playerPunctuations = applicatorChallengePunctuation.data.filter(item => item.playerChallengeId === playerChallenge.id);
          let playerPunctuation = 0;
          for (const player of playerPunctuations) {
            playerPunctuation += player.punctuation;
          }
          playerChallengesPunctuated.data[i].applicatorPunctuationTotal = playerPunctuation * applicatorStart.applicatorWeight;
          i++;
        }
      }

      if (!!applicatorStart.playerWeight && applicatorStart.playerWeight > 0) {
        const playerChallengePunctuation = await this.app.service('player-challenge-punctuations').find(acessExternal({
          query: {
            playerChallengeId: {
              $in: playerChallengesPunctuatedId
            },
          }
        })) as any;
        let i = 0;
        for (const playerChallenge of playerChallengesPunctuated.data) {
          const playerPunctuations = playerChallengePunctuation.data.filter(item => item.playerChallengeId === playerChallenge.id);
          let playerPunctuation = 0;
          for (const player of playerPunctuations) {
            playerPunctuation += player.punctuation;
          }
          playerChallengesPunctuated.data[i].playerPunctuationTotal = playerPunctuation * applicatorStart.playerWeight;
          i++;
        }
      }
      const punctuations = playerChallengesPunctuated.data.map(data => {
        return {
          playerStartId: data.playerStartId,
          playerPunctuationTotal: data.playerPunctuationTotal,
          applicatorPunctuationTotal: data.applicatorPunctuationTotal
        };
      });

      if (!applicatorStart.punctuations) {
        applicatorStart.punctuations = [{ challengeId: info.challengeId, playersPunctuations: punctuations }];
      } else {

        if (!existPunctuations) {
          applicatorStart.punctuations.push({ challengeId: info.challengeId, playersPunctuations: punctuations });
        }
      }
      setRedis(cacheClient, cacheApplicatorStart, applicatorStart);
      return { ...info, applicatorStartId: data.applicatorStartId, status: StatusChallenges.SCORE, punctuations: this.getPunctuations(applicatorStart), toFinish };
    }

    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        challengeId: info.challengeId,
        punctuated: false,
      }
    })) as any;
    if (applicatorStart.viewCodeName) {
      playerChallenges.data[0].name = applicatorStart.players.find(player => player.idFk === playerChallenges.data[0].playerStartId).name;
    }
    playerChallenges.data[0].challenge = applicatorStart.challenges.find(challenge => challenge.id === playerChallenges.data[0].challengeId);
    return {
      ...info, permissionPunctuation: { player: applicatorStart.playerWeight, applicator: applicatorStart.applicatorWeight },
      applicatorStartId: data.applicatorStartId, status: StatusChallenges.PUNCTUATE, player: playerChallenges.data[0], percentage: ((playerChallenges.data.length / info.playerCount) * 100)
    };
  }

  private getPunctuations(applicatorStart) {
    let i = 0;
    for (const player of applicatorStart.players) {
      let punctuationTotal = 0;
      const punctuations = applicatorStart.punctuations;
      for (const punctuation of punctuations) {
        const playerPunctuation = punctuation.playersPunctuations.find(_player => _player.playerStartId === player.idFk);
        if (playerPunctuation) {
          punctuationTotal += (playerPunctuation.applicatorPunctuationTotal ?
            playerPunctuation.applicatorPunctuationTotal
            : 0) + (playerPunctuation.playerPunctuationTotal ?
            playerPunctuation.playerPunctuationTotal : 0);
        }
      }
      applicatorStart.players[i].punctuation = punctuationTotal;
      i++;
    }
    return applicatorStart.players;
  }

  public async getStatus(data) {
    const cacheClient = this.app.get('redis');
    const cacheInfo = `info:${data.applicatorStartId}`;
    const infoJson = await getRedis(cacheClient, cacheInfo);
    if (infoJson === null) {
      return { status: StatusChallenges.INITIAL };
    }
    const info = JSON.parse(infoJson);
    const playerTerminetedCount = await this.app.service('player-terminated-challenges').find({
      query: {
        applicatorStartId: data.applicatorStartId,
        challengeId: info.challengeId,
      }
    }) as any;
    const dateNow = formatDateServer();
    const dateEnd = new Date(info.endTime);

    if (dateEnd > dateNow && info.playerCount > playerTerminetedCount.data.length) {
      return StatusChallenges.EXECUTION;
    }
    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        challengeId: info.challengeId,
        punctuated: false,
      }
    })) as any;

    if (playerChallenges.data.length === 0) {
      return StatusChallenges.SCORE;
    }
    return StatusChallenges.PUNCTUATE;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: Params = {},
  ): Promise<any> {
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${id}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    if (applicatorStartJson === null) {
      throwRuleException(StatusChallengesMessage.naoExisteMaisSala);
    }
    const applicatorStart = JSON.parse(applicatorStartJson);

    if (data.token) {
      const secret = this.app.get('authentication').secret;
      const userId = authenticateSocket(data.token, secret);
      const user = await this.app.service('iusers').get(userId, acessExternal(params));
      if (applicatorStart.userId !== user.idFk) {
        throwRuleException(StatusChallengesMessage.naoAplicadorSala);
      }
    }
    else if (!applicatorStart.players.find(player => player.id === data.playerId)) {
      throwRuleException(StatusChallengesMessage.naoJogadorSala);
    }

    const cacheInfo = `info:${id}`;
    const infoJson = await getRedis(cacheClient, cacheInfo);
    if (infoJson === null) {
      throwRuleException(StatusChallengesMessage.exixtirEmConjuntoComSala);
    }
    const info = JSON.parse(infoJson);
    return applicatorStart.challenges.find(challenge => challenge.id === info.challengeId);
  }
}