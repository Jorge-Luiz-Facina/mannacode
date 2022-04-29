import { SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { BaseService } from '../base';
import { Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { IApplicatorChallengePunctuationsMessage } from '../iapplicator-challenge-punctuations/iapplicator-challenge-punctuations.message';
import { getRedis } from '../../utils/redist';
import { IPlayerChallengesMessage } from '../iplayer-challenges/iplayer-challenges.message';

export class PlayerChallengePunctuation extends BaseService {
  private app: Application;

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (data.punctuation < 0 && data.punctuation > 10) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.pontuacaoNaoValida);
    }
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    const applicatorStart = JSON.parse(applicatorStartJson);
    
    const player = applicatorStart.players.find(item => item.keyOnline === data.playerStartId);
    if (!player) {
      throwRuleException(IPlayerChallengesMessage.naoPertenceAtividade);
    }
    const statusChallenges = await this.app.service('status-challenges').getStatusChallenge(
      { applicatorStartId: data.applicatorStartId });
    if (statusChallenges.status !== StatusChallenges.PUNCTUATE) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.naoFasePontuacao);
    }
    const existingPuntuaction = await super.find({
      query: {
        playerStartId: player.idFk,
        playerStartPunctuatedId: statusChallenges.player.playerStartId,
        playerChallengeId: statusChallenges.player.id
      }
    }) as any;
    if (existingPuntuaction.total > 0) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.jaPontuado);
    }
    
    data = { ...data, playerStartPunctuatedId: statusChallenges.player.playerStartId, playerChallengeId: statusChallenges.player.id, playerStartId: player.idFk };
    const playerPunctuated = await super.create(data, params);
    await this.app.service('status-players').create({ applicatorStartId: data.applicatorStartId });
    return playerPunctuated;
  }
}