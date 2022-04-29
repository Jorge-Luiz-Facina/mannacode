import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { formatDateServer, getDateEnd } from '../../utils/date';
import { delRedis, getRedis, setRedis } from '../../utils/redist';
import { applicatorNextChallengeMessage } from './applicator-next-challenge.message';
import { StatusChallenges } from '../../models/enums/status-challenges';

export class ApplicatorNextChallenge extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {

    const cacheClient = this.app.get('redis');
    const cacheInfo = `info:${data.applicatorStartId}`;
    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const infoJson = await getRedis(cacheClient, cacheInfo);
    const groupChallengeJson = await getRedis(cacheClient, cacheApplicatorStart);
    const groupChallenge = JSON.parse(groupChallengeJson);
    if (groupChallenge?.userId !== params.user?.idFk) {
      throwRuleException(applicatorNextChallengeMessage.atividadeAcabou);
    }
    let info = JSON.parse(infoJson);
    const playerTerminetedCount = await this.app.service('player-terminated-challenges').find(acessExternal({
      query: {
        applicatorStartId: data.applicatorStartId,
        challengeId: info.challengeId,
      }
    })) as any;

    const dateNow = formatDateServer();
    const dateEnd = new Date(info.endTime);

    if (dateEnd > dateNow && info.playerCount > playerTerminetedCount.length) {
      throwRuleException(applicatorNextChallengeMessage.tempoNaoAcabou);
    }
    const challenge = await this.app.service('ichallenges').get(info.challengeId, acessExternal(params));
    const nextChallenge = await this.app.service('ichallenges').find(acessExternal({
      query: {
        groupChallengeId: groupChallenge.id,
        index: challenge.index + 1
      },
    })) as any;

    if (nextChallenge.total === 0) {
      delRedis(cacheClient, cacheInfo);
      delRedis(cacheClient, `applicator-start:${data.applicatorStartId}`);
      await this.app.service('iapplicator-start').patch(data.applicatorStartId, { status: StatusChallenges.END },
        acessExternal(params));

      await this.app.service('group-challenges').get(data.groupChallengeId, params);
      await this.app.service('igroup-challenges').patch(data.groupChallengeId, { status: StatusChallenges.END },
        acessExternal(params));
      await this.app.service('status-challenges').create({ applicatorStartId: data.applicatorStartId });
      return { status: StatusChallenges.END };
    }
    const endTime = getDateEnd(nextChallenge.data[0].time);
    info = { playerCount: info.playerCount, challengeId: nextChallenge.data[0].id, startTime: formatDateServer(), endTime };
    setRedis(cacheClient, cacheInfo, info);
    await this.app.service('status-challenges').create({ applicatorStartId: data.applicatorStartId });
    return { ...info, status: StatusChallenges.INITIALIZED };
  }
}
