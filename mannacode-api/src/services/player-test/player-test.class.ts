import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { AdapterService } from '../adapter-service';
import { getRedis } from '../../utils/redist';
import { acessExternal } from '../../utils/acess-external';
import { formatDateServer } from '../../utils/date';
import { IChallengesMessage } from '../ichallenges/ichallenges.message';
import { IPlayerChallengesMessage } from '../iplayer-challenges/iplayer-challenges.message';
import { IUsersMessage } from '../iusers/iusers.message';
import { GroupChallengeType } from '../../models/enums/group-challenge.enum';
import { StatusChallenges } from '../../models/enums/status-challenges';

export class PlayerTest extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const cacheClient = this.app.get('redis');
    const cacheApplicatorStart = `applicator-start:${data.applicatorStartId}`;
    const cacheInfo = `info:${data.applicatorStartId}`;
    const applicatorStartJson = await getRedis(cacheClient, cacheApplicatorStart);
    const infoJson = await getRedis(cacheClient, cacheInfo);

    if (applicatorStartJson === null || infoJson === null) {
      throwRuleException(IChallengesMessage.naoExisteAtividade);
    }

    const applicatorStart = JSON.parse(applicatorStartJson);
    const info = JSON.parse(infoJson);
    if (!applicatorStart.players.find(item => item.keyOnline === data.id)) {
      throwRuleException(IChallengesMessage.naoPertenceAtividade);
    }
    const dateNow = formatDateServer();
    const dateEnd = new Date(info.endTime);

    if (dateEnd < dateNow) {
      throwRuleException(IPlayerChallengesMessage.tempoAcabou);
    }

    const challenge = applicatorStart.challenges.find(item => item.id === info.challengeId);
    const result = await this.app.service('code-executor').create({
      code: data.code, test: challenge.test,
      language: data.language,
      playerId: data.id,
      applicatorStartId: data.applicatorStartId
    }, acessExternal(params));

    return this.app.service('code-executor').getOutput(result.tests[0], data.language, data.code);
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    if (!data.token) {
      throwRuleException(IUsersMessage.autenticado);
    }
    const challenge = await this.app.service('ichallenges').get(id, acessExternal(params));
    const player = await this.app.service('authentication-player').get(data.token, params);
    const applicatorStartGroupChallenge = await this.app.service('applicator-start-group-challenge').find(acessExternal({
      query: {
        applicatorStartId: player.applicatorStartId,
        groupChallengeId: challenge.groupChallengeId
      }
    })) as any;
    if (applicatorStartGroupChallenge.total < 1) {
      throwRuleException('Não existe essa atividade');
    }

    const groupChallenge = await this.app.service('igroup-challenges').get(challenge.groupChallengeId, acessExternal(params));
    if (!groupChallenge || groupChallenge.type !== GroupChallengeType.SOLO || groupChallenge.status === StatusChallenges.END) {
      throwRuleException('Essa não é uma atividade valida');
    }

    const playerCode = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: player.idFk, challengeId: challenge.id,
      },
      paginate: false
    })) as any;
    const date = formatDateServer();
    const validity = new Date(groupChallenge.validity);
    let endTime = new Date(playerCode[0].started);
    endTime.setMinutes(endTime.getMinutes() + challenge.time);
    if (endTime < date || validity < date) {
      throwRuleException(IPlayerChallengesMessage.tempoAcabou);
    }
    data.applicatorStartId = player.applicatorStartId;
    data.playerStartId = player.idFk;
    const result = await this.app.service('player-challenges').executeCode(data, challenge.test, params);
    return result.output;
  }
}
