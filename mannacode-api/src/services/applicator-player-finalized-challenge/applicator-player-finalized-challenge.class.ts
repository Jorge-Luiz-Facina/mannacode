import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';
import { applicatorPlayerFinalizedChallengeMessage } from './applicator-player-finalized-challenge.message';

export class applicatorPlayerFinalizedChallenge extends AdapterService {
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
      !params.query.pageSize === undefined || !params.query?.challengeId === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };
    const challenge = await this.app.service('ichallenges').get(params.query?.challengeId, acessExternal(newParams));
    await this.app.service('group-challenges').get(challenge.groupChallengeId, newParams);

    const challenges = this.app.service('iplayer-challenges');
    const playerChallenges = await challenges.find(acessExternal({
      query: {
        challengeId: params.query?.challengeId,
        $skip: (params.query?.page - 1) * params.query?.pageSize,
        $limit: params.query?.pageSize,
        $sort: params.query?.$sort
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
    const playerIds = playerChallenges.data.map(item => item.playerStartId);

    const players = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: {
          $in: playerIds
        },
      },
    })) as any;
    let i = 0;
    for (const playerChallenge of playerChallenges.data) {
      const player = players.data.find(item => item.idFk === playerChallenge.playerStartId);
      playerChallenges.data[i].name = player?.name;
      i++;
    }
    i = 0;
    for (const playerChallenge of playerChallenges.data) {
      const applicatorChallengePunctuation = applicatorChallengePunctuations.data.find(item => item.playerChallengeId === playerChallenge.id);
      playerChallenges.data[i].punctuation = applicatorChallengePunctuation?.punctuation;
      i++;
    }

    return playerChallenges;
  }


  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const playerChallenge = await this.app.service('iplayer-challenges').get(data.playerChallengeId, acessExternal(params));
    let player = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: playerChallenge.playerStartId,
      },
      paginate: false
    })) as any;
    player = player[0];
    await this.app.service('applicator-start').get(player.applicatorStartId, acessExternal(params));
    const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerChallengeId: playerChallenge.id
      },
    })) as any;

    if (applicatorChallengePunctuations.total > 0) {
      throwRuleException(applicatorPlayerFinalizedChallengeMessage.jaPontuado);
    }
    return await this.app.service('iapplicator-challenge-punctuations').create(
      { punctuation: data.punctuation, playerStartPunctuatedId: player.idFk, playerChallengeId: playerChallenge.id },
      acessExternal(params));
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const playerChallenge = await this.app.service('iplayer-challenges').get(id, acessExternal(params));
    let player = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: playerChallenge.playerStartId,
      },
      paginate: false
    })) as any;
    player = player[0];
    const challenge = await this.app.service('ichallenges').get(playerChallenge.challengeId, acessExternal(params));
    await this.app.service('applicator-start').get(player.applicatorStartId, acessExternal(params));
    const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerChallengeId: playerChallenge.id,
        playerStartPunctuatedId: player.idFk
      },
    })) as any;

    playerChallenge.punctuation = applicatorChallengePunctuations.data[0]?.punctuation;
    playerChallenge.name = player.name;
    playerChallenge.challenge = challenge;
    return playerChallenge;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const playerChallenge = await this.app.service('iplayer-challenges').get(id, acessExternal(params));
    let player = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        idFk: playerChallenge.playerStartId,
      },
      paginate: false
    })) as any;
    player = player[0];
    await this.app.service('applicator-start').get(player.applicatorStartId, acessExternal(params));
    const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerChallengeId: playerChallenge.id,
        playerStartPunctuatedId: player.idFk
      },
    })) as any;

    if (applicatorChallengePunctuations.total === 0) {
      throwRuleException(applicatorPlayerFinalizedChallengeMessage.naoPontuado);
    }
    return await this.app.service('iapplicator-challenge-punctuations').patch(applicatorChallengePunctuations.data[0].id,
      { punctuation: data.punctuation },
      acessExternal(params));
  }

}
