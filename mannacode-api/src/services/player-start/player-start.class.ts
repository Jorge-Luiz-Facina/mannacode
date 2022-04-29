import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { PlayerStartStatus } from '../../models/enums/status-player-start';
import { IUsersMessage } from '../iusers/iusers.message';
import { AdapterService } from '../adapter-service';
import { getRedis, setRedis } from '../../utils/redist';
import { IPlayerStartMessage } from '../iplayer-start/iplayer-start.message';
import { v4 as uuidv4 } from 'uuid';

export class PlayerStart extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    if (!params.query || !params.query.page === undefined || !params.query.pageSize === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };

    const groupChallenge = await this.app.service('group-challenges').get(params.query?.groupChallengeId, newParams);
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find({
      query: {
        groupChallengeId: params.query?.groupChallengeId
      }
    }) as any;
    if (!applicatorStartGroupChallenge.data[0]) {
      throwRuleException(IPlayerStartMessage.semReferenciaSala);
    }
    const playerStart = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        applicatorStartId: applicatorStartGroupChallenge.data[0]?.applicatorStartId,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        $sort: params.query?.$sort
      },
    })) as any;
    let i = 0;
    for (const player of playerStart.data) {
      playerStart.data[i].punctuationTotal = await this.punctuationTotal(player.idFk, groupChallenge);
      i++;
    }
    playerStart.data.forEach(function (item) { delete item.key; });
    return playerStart;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!data.key || data.key === '') {
      throwRuleException(IPlayerStartMessage.chaveInvalida);
    }
    if (!data.name || data.name === '') {
      throwRuleException(IPlayerStartMessage.digiteNome);
    }
    const applicatorStart = await this.app.service('iapplicator-start').find(acessExternal({
      query: {
        key: data.key,
        status: PlayerStartStatus.INITIAL
      },
      paginate: false
    })) as any;

    if (applicatorStart.length === 0) {
      throwRuleException(IPlayerStartMessage.chaveInvalidaOuNaoExite);
    }
    const playerStart = await this.app.service('iplayer-start').create(
      {
        name: data.name, applicatorStartId: applicatorStart[0].id, key: '',
        status: PlayerStartStatus.INITIAL, keyOnline: uuidv4()
      }, acessExternal(params));
    await this.app.service('status-players').create({ applicatorStartId: applicatorStart[0].id }, params);

    return playerStart;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async get(id: Id, params: Params = {}): Promise<any> {

    const existingPlayerConnect = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        keyOnline: id,
        status: {
          $nin: [PlayerStartStatus.END, PlayerStartStatus.BAN]
        },
      }
    })) as any;
    if (existingPlayerConnect.total === 0) {
      throwRuleException(IPlayerStartMessage.naoFazParteDaSala);
    }

    return await this.app.service('status-challenges').getStatusChallenge(
      { applicatorStartId: existingPlayerConnect.data[0].applicatorStartId });
  }
  public async remove(id: Id, params: Params = {}): Promise<any> {
    const player = await this.app.service('iplayer-start').get(id, acessExternal(params));
    await this.app.service('applicator-start').get(player.applicatorStartId, acessExternal(params));
    await this.app.service('status-challenges');
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${player.applicatorStartId}`;
    const groupChallengeJson = await getRedis(cacheClient, cacheApplicatorStart);
    const groupChallenge = JSON.parse(groupChallengeJson);
    groupChallenge.players = groupChallenge.players.filter(player => player.id !== id);
    setRedis(cacheClient, cacheApplicatorStart, groupChallenge);

    return this.app.service('iplayer-start').patch(id, { status: PlayerStartStatus.BAN }, acessExternal(params));
  }

  private async punctuationTotal(playerStartId, groupChallenge) {
    let punctuationTotal = 0;
    const playerChallenges = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: playerStartId,
      },
    })) as any;

    for (const playerChallenge of playerChallenges.data) {
      let ChallengePunctuationTotal = 0;
      if (groupChallenge.playerWeight !== 0) {
        const playerChallengePunctuations = await this.app.service('player-challenge-punctuations').find(acessExternal({
          query: {
            playerChallengeId: playerChallenge.id,
          },
          paginate: false
        })) as any;

        for (const _playerStart of playerChallengePunctuations) {
          ChallengePunctuationTotal += _playerStart.punctuation * groupChallenge.playerWeight;
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
          ChallengePunctuationTotal += applicatorChallengePunctuations[0].punctuation * groupChallenge.applicatorWeight;
        }
      }
      punctuationTotal += ChallengePunctuationTotal;
    }
    return punctuationTotal;
  }
}