import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { acessExternal } from '../../utils/acess-external';

export class NextPlayerChallenges extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    await this.app.service('applicator-start').get(data.applicatorStartId, params);
    let statusChallenges = await this.app.service('status-challenges').getStatusChallenge({ applicatorStartId: data.applicatorStartId });
    if(statusChallenges.status !== StatusChallenges.PUNCTUATE){
      throwRuleException('Você não esta na etapa de pontuação');
    }
    await this.app.service('iplayer-challenges').patch(statusChallenges.player.id, { punctuated: true }, acessExternal(params));
    statusChallenges = await this.app.service('status-challenges').create({ applicatorStartId: data.applicatorStartId });
    if(statusChallenges.status === StatusChallenges.SCORE){
      await this.app.service('status-players').create({ applicatorStartId: data.applicatorStartId });
    }
    await this.app.service('status-players').create({ applicatorStartId: data.applicatorStartId });
    return statusChallenges;
  }
}
