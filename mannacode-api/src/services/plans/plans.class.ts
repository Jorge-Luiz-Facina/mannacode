import { Id, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { throwRuleException } from '../../utils/exception';
import { AdapterService } from '../adapter-service';
import { IUsersMessage } from '../iusers/iusers.message';

export class Plans extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const plan = await this.app.service('iplans').find({
      query: { userId: params.user?.idFk, active: true },
    }) as any;
    if (plan.data.length === 0) {
      throwRuleException('Você não tem planos ativos');
    }
    const applicatorStarts = await this.app.service('iapplicator-start').find({
      query: {
        type: ApplicatorStartType.ROOM_SOLO,
        userId: params.user?.idFk,
        status: {
          $or: [
            { $ne: StatusChallenges.END },
            null
          ],
        }
      }
    }) as any;
    const applicatorStartsId = applicatorStarts.data.map(item => item.id);

    if (applicatorStartsId.length === 0) {
      plan.data[0].playersClass = 0;
      return plan.data[0];
    }
    const players = await this.app.service('iplayer-start').find({
      query: {
        $limit: 0,
        applicatorStartId: {
          $in: applicatorStartsId.length === 0 ? [] : applicatorStartsId
        },
        status: {
          $or: [
            { $ne: StatusChallenges.END },
            null
          ],
        }
      }
    }) as any;

    plan.data[0].playersClass = players.total;

    return plan.data[0];
  }
}
