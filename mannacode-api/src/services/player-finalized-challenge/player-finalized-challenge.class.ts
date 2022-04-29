import { Application } from '../../declarations';
import { Params, Id } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';
import { AdapterService } from '../adapter-service';
import { acessExternal } from '../../utils/acess-external';
import { formatDateServer } from '../../utils/date';
import { IUsersMessage } from '../iusers/iusers.message';

export class PlayerFinalizedChallenge extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async get(id: Id, params: Params = {}): Promise<any> {
    const newParams = { ...params, query: {} };

    const player = await this.app.service('authentication-player').get(id, newParams);
    if (!params.query?.challengeId || !params.query.playerId || !params.query.groupChallengeId) {
      throwRuleException(IUsersMessage.buscaInvalida);
    }
    const playerSelcted = await this.app.service('iplayer-start').get(params.query?.playerId, acessExternal(newParams));
    if (playerSelcted.applicatorStartId !== player.applicatorStartId) {
      throwRuleException('Você não é da mesma turma desse jogador');
    }
    const groupChallenge = await this.app.service('igroup-challenges').get(params.query?.groupChallengeId, acessExternal(newParams));
    if (!groupChallenge.viewPlayersFinishedChallenge) {
      throwRuleException('Essa atividade não term permissão para visulizar jogadores que termiram o desafio');
    }

    const challenge = await this.app.service('ichallenges').get(params.query?.challengeId, acessExternal(newParams));

    let playerChallenge = await this.app.service('iplayer-challenges').find(acessExternal({
      query: {
        playerStartId: playerSelcted.idFk,
        challengeId: challenge.id
      },
      paginate: false
    })) as any;
    if (playerChallenge.length === 0) {
      throwRuleException('Não existe desafio relacionado a esse jogador');
    }
    playerChallenge = playerChallenge[0];
    delete playerChallenge[0];
    const date = formatDateServer();
    const validity = new Date(groupChallenge.validity);
    const endTime = new Date(playerChallenge.started);
    endTime.setMinutes(endTime.getMinutes() + challenge.time);
    if (!(endTime < date || playerChallenge.passTest || validity < date)) {
      throwRuleException('O jogador não finalizou o desafio');
    }
    const applicatorChallengePunctuations = await this.app.service('iapplicator-challenge-punctuations').find({
      query: {
        playerChallengeId: playerChallenge.id,
        playerStartPunctuatedId: playerSelcted.idFk,
      },
      paginate: false,
    }) as any;
    playerChallenge.punctuation = applicatorChallengePunctuations[0]?.punctuation;

    playerChallenge.challenge = challenge;
    playerChallenge.name = playerSelcted.name;
    return playerChallenge;
  }

}