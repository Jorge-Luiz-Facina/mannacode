import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { IApplicatorChallengePunctuationsMessage } from '../iapplicator-challenge-punctuations/iapplicator-challenge-punctuations.message';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';

export class ApplicatorChallengePunctuation extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (data.punctuation < 0 && data.punctuation > 10) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.pontuacaoNaoValida);
    }
    const statusChallenges = await this.app.service('status-challenges').getStatusChallenge(
      { applicatorStartId: data.applicatorStartId });
    if (statusChallenges.status !== StatusChallenges.PUNCTUATE) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.naoFasePontuacao);
    }

    const existingPuntuaction =   await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
      query: {
        playerStartPunctuatedId: statusChallenges.player.playerStartId,
        playerChallengeId: statusChallenges.player.id
      }
    })) as any;
    if (existingPuntuaction.total > 0) {
      throwRuleException(IApplicatorChallengePunctuationsMessage.jaPontuado);
    }
    
    data = { ...data, playerStartPunctuatedId: statusChallenges.player.playerStartId, playerChallengeId:statusChallenges.player.id };
    return await this.app.service('iapplicator-challenge-punctuations').create(data, acessExternal(params));
  }

}
