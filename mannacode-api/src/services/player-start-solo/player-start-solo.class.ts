import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { acessExternal } from '../../utils/acess-external';
import { PlayerStartStatus } from '../../models/enums/status-player-start';
import { IUsersMessage } from '../iusers/iusers.message';
import { AdapterService } from '../adapter-service';
import { IApplicatorStartMessage } from '../iapplicator-start/iapplicator-start.message';
import { generateKey } from '../../utils/generate';

export class PlayerStartSolo extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async find(params: Params = {}): Promise<any> {
    if (!params.user || !params.user.id) {
      throwRuleException(IUsersMessage.autenticado);
    }

    if (!params.query || !params.query.page === undefined || !params.query.pageSize === undefined || !params.query.applicatorStartId === undefined) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const newParams = { ...params, query: {} };

    await this.app.service('applicator-start').get(params.query?.applicatorStartId, newParams);

    if (params.query?.$sort?.punctuationTotal) {
      const plan = await this.app.service('plans').get(0, params);
      const playerStart = await this.app.service('iplayer-start').find(acessExternal({
        query: {
          applicatorStartId: params.query?.applicatorStartId,
          $limit: plan.numberPlayers,
          status: {
            $or: [
              { $ne: PlayerStartStatus.END },
              null
            ],
          },
        },
      })) as any;
      playerStart.data.forEach(function (item) { delete item.key; });
      let i = 0;
      for (const player of playerStart.data) {
        const playerPunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
          query: {
            playerStartPunctuatedId: player.idFk
          }
        })) as any;
        let punctuationTotal = 0;
        for (const item of playerPunctuations.data) {
          punctuationTotal += item.punctuation ? item.punctuation : 0;
        }
        playerStart.data[i].punctuationTotal = punctuationTotal;
        i++;
      }
      if (params.query?.$sort?.punctuationTotal === '1') {
        playerStart.data.sort((a, b) => (a.punctuationTotal > b.punctuationTotal) ? 1 : -1);
      }
      else {
        playerStart.data.sort((a, b) => (a.punctuationTotal < b.punctuationTotal) ? 1 : -1);
      }
      playerStart.data = playerStart.data.slice((params.query?.page - 1) * params.query?.pageSize, params.query?.pageSize * params.query?.page);
      return playerStart;

    } else {
      const playerStart = await this.app.service('iplayer-start').find(acessExternal({
        query: {
          applicatorStartId: params.query?.applicatorStartId,
          $skip: (params.query?.page - 1) * params.query?.pageSize,
          $limit: params.query?.pageSize,
          $sort: params.query?.$sort,
          status: {
            $or: [
              { $ne: PlayerStartStatus.END },
              null
            ],
          },
        },
      })) as any;
      playerStart.data.forEach(function (item) { delete item.key; });
      let i = 0;
      for (const player of playerStart.data) {
        const playerPunctuations = await this.app.service('iapplicator-challenge-punctuations').find(acessExternal({
          query: {
            playerStartPunctuatedId: player.idFk
          }
        })) as any;
        let punctuationTotal = 0;
        for (const item of playerPunctuations.data) {
          punctuationTotal += item.punctuation ? item.punctuation : 0;
        }
        playerStart.data[i].punctuationTotal = punctuationTotal;
        i++;
      }
      return playerStart;
    }

  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const plan = await this.app.service('plans').get(0, params);
    if (!data.applicatorStartId) {
      throwRuleException(IApplicatorStartMessage.voceDeveCriarTurmaPrimeiro);
    }
    if (!data.player.name || !data.player.email) {
      throwRuleException('Esta falatando alguma informação');
    }
    const applciatorStart =  await this.app.service('applicator-start').get(data.applicatorStartId, params);
    const existingPlayerName = await this.app.service('iplayer-start').find(acessExternal({
      query: {
        name: data.player.name,
        status: {
          $or: [
            { $ne: PlayerStartStatus.END },
            null
          ],
        },
        applicatorStartId: data.applicatorStartId,
      }
    })) as any;
    if (existingPlayerName.total > 0) {
      throwRuleException('Já existe jogadores com nomes que você tentou adicionar');
    }
    if ((plan.numberPlayers - plan.playersClass) < 1) {
      throwRuleException(IUsersMessage.ultrapassouLimiteJogadores);
    }
    const playerCreate = await this.app.service('iplayer-start').create({
      name: data.player.name, email: data.player.email,
      applicatorStartId: data.applicatorStartId, status: PlayerStartStatus.INITIAL, key: generateKey(10)
    }, acessExternal(params));

    await this.sendRegisterEmail(playerCreate, applciatorStart.key);
    delete playerCreate.key;
    return playerCreate;
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {
    let player;
    if (data.token) {
      player = await this.app.service('authentication-player').get(params.query?.token, params);
    } else {
      player = await this.app.service('iplayer-start').get(id, acessExternal(params));
      const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, params);
      if (applicatorStart.userId !== params.user!.idFk) {
        throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
      }
    }
    return await this.app.service('iplayer-start').patch(player.id, { key: generateKey(10) }, acessExternal(params));
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const player = await this.app.service('iplayer-start').get(id, acessExternal(params));
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    player.keyClass = applicatorStart.key;
    return player;
  }

  public async remove(id: Id, params: Params = {}): Promise<any> {
    const player = await this.app.service('iplayer-start').get(id, acessExternal(params));
    const applicatorStart = await this.app.service('iapplicator-start').get(player.applicatorStartId, acessExternal(params));
    if (applicatorStart.userId !== params.user!.idFk) {
      throwRuleException(IApplicatorStartMessage.voceNaoDeveriaTerAcessoTurma);
    }
    return await this.app.service('iplayer-start').patch(id, { status: PlayerStartStatus.END }, acessExternal(params));
  }

  public async sendRegisterEmail(player: any, key) {
    const url = `${this.app.get('webURL')}/class/player/login?keyClass=${key}`;

    const html = `
    <div style="width: 100%; background: #F6F9FB; padding: 32px;">
      <p>Olá ${player.name},</p>
      <p>Você está recebendo este e-mail porque recebemos uma solicitação de cadastro como jogador de uma turma na www.class-coding.com.</p>
      <p>Se você não solicitou o cadastro, basta desconsiderar este e-mail.</p>
      <p></p>
      <p>Link acesso : ${url}</p>
      <p>Login: ${player.name}</p>
      <p>Chave: ${player.key}</p>
    </div>`;
    if (process.env.NODE_ENV !== 'production') {
      player.email = 'your@gmail.com';
    }
    await this.app.service('mailer').create({
      html,
      subject: 'class-coding - Verificação de e-mail jogador',
      to: player.email,
    });
  }
}