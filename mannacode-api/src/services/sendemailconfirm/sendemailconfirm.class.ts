import { throwRuleException } from '../../utils/exception';
import { Application } from '../../declarations';
import { AdapterService } from '../adapter-service';
import { Params } from '@feathersjs/feathers';
import { IUsersMessage } from '../iusers/iusers.message';

export class SendEmailConfirm extends AdapterService {

  private app: Application;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params?: Params): Promise<any> {
    try {
      const { emailConfirm } = data;

      if (!emailConfirm) {
        throwRuleException('Não foi possível verificar o e-mail. Contate o administrador');
      }

      let user;
      if (!data.user) {
        const users = await this.app.service('users').find({
          query: {
            email: emailConfirm,
          },
        });
        if (users.total === 0) {
          throwRuleException(IUsersMessage.emailNaoRegistrado);
        }
        user = users.data[0];
        if (user.verifiedEmail) {
          throwRuleException(IUsersMessage.emailConfirmado);
        }
      } else {
        user = data.user;
      }

      await this.sendRegisterEmail(user);
      return { ok: true };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async sendRegisterEmail(player: any) {
    const url = `${this.app.get('webURL')}/register/init?token=${player.verifyToken}`;

    const html = `
    <div style="width: 100%; background: #F6F9FB; padding: 32px;">
      <p>Olá ${player.name},</p>
      <p>Você está recebendo este e-mail porque recebemos uma solicitação de cadastro da sua conta.</p>
      <p>Se você não solicitou o cadastro, basta desconsiderar este e-mail.</p>
      <p>Se o link não funcionar copie o endereço abaixo e cole no seu navegador</p>
      <p>${url}</p>
    </div>`;
    if (process.env.NODE_ENV !== 'production') {
      player.email = 'your@gmail.com';
    }
    await this.app.service('mailer').create({
      html,
      subject: 'class-coding - Verificação de e-mail',
      to: player.email,
    });
  }
}
