import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';

export class GroupChallengesStatus extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const serviceGroupChallenges = this.app.service('igroup-challenges');
    const existingGroupChallenge = await serviceGroupChallenges.find(acessExternal({
      query: {
        userId: params.user?.idFk,
        type: GroupChallengeType.MULTIPLAYER,

        status: {
          $or: [
            { $ne: StatusChallenges.END },
            null
          ],
        }
      },
    })) as any;
    if (existingGroupChallenge.total < 1) {
      return [];
    }
    return existingGroupChallenge.data[0];
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    if (!params.query || !data.page === undefined || !data.pageSize === undefined || !data.type) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: data.applicatorStartId
      }
    })) as any;
    const GroupChallengesId = applicatorStartGroupChallenge.data.map(item => item.groupChallengeId);
    const serviceGroupChallenges = this.app.service('igroup-challenges');
    return await serviceGroupChallenges.find(acessExternal({
      query: {
        id: {
          $in: GroupChallengesId
        },
        userId: params.user?.idFk,
        $skip: (data.page - 1) * data.pageSize,
        $limit: data.pageSize,
        type: data.type,
        $sort: params.query?.$sort
      },
    })) as any;
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find({
      query: {
        groupChallengeId: id
      }
    }) as any;
    if (applicatorStartGroupChallenge.total > 0) {
      const applicatorStart = await this.app.service('iapplicator-start').get(applicatorStartGroupChallenge.data[0].applicatorStartId, acessExternal(params));
      if (applicatorStart.status === ApplicatorStartType.ROOM_MULTIPLAYER) {
        this.app.service('iapplicator-start').patch(applicatorStart.id, { status: StatusChallenges.END }, acessExternal(params));
      }
    }
    return await this.app.service('igroup-challenges').patch(id, { status: StatusChallenges.END }, acessExternal(params)) as any;
  }
}