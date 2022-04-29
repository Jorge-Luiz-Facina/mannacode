import { Application } from '../../declarations';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { throwRuleException } from '../../utils/exception';
import { authenticatePlayer, getToken } from '../../utils/authenticate-socket';
import { PlayerStartStatus } from '../../models/enums/status-player-start';
import { acessExternal } from '../../utils/acess-external';
import { generateKey } from '../../utils/generate';
import { ApplicatorStartType } from '../../models/enums/applicator-start.enum';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { StatusChallenges } from '../../models/enums/status-challenges';
import { authenticationPlayerMessage } from './authentication-player.message';

export class AuthenticationPlayer extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params: Params = {}): Promise<any> {

    if (!data.keyClass || !data.name || !data.key) {
      throwRuleException(authenticationPlayerMessage.faltandoAlgumDado);
    }
    const applicatorStart = await this.app.service('iapplicator-start').find({
      query: {
        key: data.keyClass
      }
    }) as any;

    if (applicatorStart.total !== 1) {
      throwRuleException(authenticationPlayerMessage.linkTurmaIncorreto);
    }
    const player = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        applicatorStartId: applicatorStart.data[0].id,
        name: data.name,
        key: data.key
      }
    })) as any;

    if (player.total !== 1) {
      throwRuleException(authenticationPlayerMessage.nomeChaveIncorreto);
    }
    const playerConfig = this.app.get('player');
    if (player.data[0].status === PlayerStartStatus.INITIAL) {
      await this.app.service('iplayer-start').patch(player.data[0].id, { status: PlayerStartStatus.INITIALIZED }, acessExternal(params));
    }
    const token = getToken({ sub: player.data[0].id }, playerConfig.secret);
    return { name: player.data[0].name, token, email: player.data[0].email };
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const playerConfig = this.app.get('player');
    const playerId = authenticatePlayer(id, playerConfig.secret);
    if (!playerId) {
      throwRuleException(authenticationPlayerMessage.naoEstaAutenticado);
    }
    const player = await this.app.service('iplayer-start').get(playerId, acessExternal(params));
    if (player.status === StatusChallenges.END) {
      throwRuleException(authenticationPlayerMessage.banidoTurma);
    }
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(params));
    if (applicatorStart.type !== ApplicatorStartType.ROOM_SOLO) {
      throwRuleException(authenticationPlayerMessage.tipoNaoDisponivel);
    }
    const plan = await this.app.service('iplans').find({
      query: { userId: applicatorStart.userId, active: true },
    }) as any;
    if (plan.total === 0) {
      throwRuleException(authenticationPlayerMessage.instrutorNaoTemPlanosAtivos);
    }
    return player;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    const player = await this.app.service('iplayer-start').get(id, acessExternal(params));
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    const updatePlayer = await this.app.service('iplayer-start').patch(player.id, { status: PlayerStartStatus.INITIAL, key: generateKey(10) }, acessExternal(params));
    await this.app.service('player-start-solo').sendRegisterEmail(updatePlayer, applicatorStart.key);
    return 'sucess';
  }
}