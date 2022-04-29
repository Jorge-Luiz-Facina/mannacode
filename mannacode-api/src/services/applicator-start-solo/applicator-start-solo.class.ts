import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { IUsersMessage } from '../iusers/iusers.message';
import { acessExternal } from '../../utils/acess-external';
import { AdapterService } from '../adapter-service';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';
import { generateKey } from '../../utils/generate';
import { StatusChallenges } from '../../models/enums/status-challenges';

export class ApplicatorStartSolo extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  
  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    const newParams = { ...params, query: { ...params.query, userId: params.user?.idFk } };
    const applicatorStart = await this.app.service('iapplicator-start').find(acessExternal(newParams)) as any;

    return applicatorStart;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    let key = generateKey(6);

    let existingApplicatorStart = await this.app.service('iapplicator-start').find({
      query: { key }, paginate: false
    }) as any;

    while (existingApplicatorStart.length > 0) {
      key = generateKey(6);
      existingApplicatorStart = this.app.service('iapplicator-start').find({
        query: { key }, paginate: false
      }) as any;
    }
    return await this.app.service('iapplicator-start').create({
      name: data.name, status: StatusChallenges.NORMAL,
      userId: params.user?.idFk, key, type: ApplicatorStartType.ROOM_SOLO
    }, acessExternal(params));
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const applicatorStart = await this.app.service('iapplicator-start').get(id, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    const players = await this.app.service('iplayer-start').find({
      query: {
        $limit: 0,
        applicatorStartId: applicatorStart.id,
        status: {
          $or: [
            { $ne: StatusChallenges.END },
            null
          ],
        }
      }
    }) as any;
    applicatorStart.numberPlayers = players.total;
    return applicatorStart;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {

    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const applicatorStart = await this.app.service('iapplicator-start').get(id, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    if (!data.classificationLength && data.classificationLength !== 0) {
      data.classificationLength = null;
    }
    return await this.app.service('iapplicator-start').patch(id, { name: data.name, classificationLength: data.classificationLength }, acessExternal(params));
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const applicatorStart = await this.app.service('iapplicator-start').get(id, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    return await this.app.service('iapplicator-start').remove(id, acessExternal(params)) as any;
  }

}