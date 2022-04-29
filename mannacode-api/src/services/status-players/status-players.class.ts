import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { getRedis } from '../../utils/redist';
import { throwRuleException } from '../../utils/exception';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { PlayerStartStatus } from '../../models/enums/status-player-start';
import { acessExternal } from '../../utils/acess-external';
import { StatusChallengesMessage } from '../status-challenges/status-challenges.message';
import axios from 'axios';

export class StatusPlayer extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const mannasocket = this.app.get('mannasocket');

    const statusPlayers = await this.getStatusPlayers(data);
    const newData = { ...statusPlayers, user: { login: mannasocket.login, password: mannasocket.password } };
    await axios({
      method: 'post',
      url: `${mannasocket.host}/status-players`,
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
    return statusPlayers;
  }

  public async get(
    id: Id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: Params = {},
  ): Promise<any> {
    return await this.getStatusPlayers(
      { applicatorStartId: id });
  }

  public async getStatusPlayers(data) {
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    if (applicatorStartJson === null) {
      const players = await this.app.service('iplayer-start').find({
        query: {
          applicatorStartId: data.applicatorStartId,
          status: { $ne: PlayerStartStatus.BAN }
        }
      }) as any;
      players.data.forEach(function (item) { delete item.key; });
      return { applicatorStartId: data.applicatorStartId, players: players.data };
    }
    const applicatorStart = JSON.parse(applicatorStartJson);
    const status = await this.app.service('status-challenges').getStatus(data);
    if (StatusChallenges.EXECUTION !== status && StatusChallenges.PUNCTUATE !== status) {
      return { applicatorStartId: data.applicatorStartId, players: applicatorStart.players };
    }

    const cacheInfo = `info:${data.applicatorStartId}`;
    const infoJson = await getRedis(cacheClient, cacheInfo);
    if (infoJson === null) {
      throwRuleException(StatusChallengesMessage.naoExisteMaisSala);
    }
    const info = JSON.parse(infoJson);

    if (StatusChallenges.EXECUTION === status) {
      const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
        query: {
          challengeId: info.challengeId,
        }
      })) as any;
      let i = 0;
      for (const player of applicatorStart.players) {
        applicatorStart.players[i].passTest = playerChallenges.data.find(playerChallenge => playerChallenge.playerStartId === player.idFk)?.passTest;
        i++;
      }
      return { applicatorStartId: data.applicatorStartId, players: applicatorStart.players };
    }
    if (StatusChallenges.PUNCTUATE === status) {
      const statusPunctuate = await this.app.service('status-challenges').getStatusChallenge(data);
      const playerChallengePunctuations = await this.app.service('player-challenge-punctuations').find(acessExternal({
        query: {
          playerChallengeId: statusPunctuate.player.id,
        }
      })) as any;

      let i = 0;
      for (const player of applicatorStart.players) {
        applicatorStart.players[i].punctuated = !!playerChallengePunctuations.data.find(playerChallengePunctuation => playerChallengePunctuation.playerStartId === player.idFk);
        i++;
      }
      return { applicatorStartId: data.applicatorStartId, players: applicatorStart.players };
    }
  }
}
