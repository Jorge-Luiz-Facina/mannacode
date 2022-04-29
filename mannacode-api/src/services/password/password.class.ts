import { Application } from '../../declarations';
import { throwRuleException } from '../../utils/exception';
import { Id, Params } from '@feathersjs/feathers';
import { AdapterService } from '../adapter-service';
import { uuid } from 'uuidv4';
import { omit } from 'lodash';
import { validateEmail } from '../../utils/validate';
import { formatDateServer } from '../../utils/date';
import { IUsersMessage } from '../iusers/iusers.message';
import { PasswordMessage } from './password.message';

export class Password extends AdapterService {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public async create(data: Partial<any>, params: Params = {}): Promise<any> {
    const iuserService = this.app.service('iusers');

    if (!data.email || !validateEmail(data.email)) {
      throwRuleException(PasswordMessage.emailInvalido);
    }

    const existingPlayer = await iuserService.find({
      query: {
        email: data.email
      },
      paginete: false
    }) as any;

    if (existingPlayer.total === 0) {
      return { message: IUsersMessage.emailVinculadoConta };
    }
    const player = await iuserService.patch(existingPlayer.data[0].id, { newPasswordToken: uuid(), newPasswordDate: new Date() }, omit(params, 'provider'));
    await this.sendNewPasswordEmail(player);
    return { message: IUsersMessage.emailVinculadoConta };
  }

  public async patch(
    id: Id,
    data: Partial<any>,
    params: Params = {},
  ): Promise<any> {

    const iuserService = this.app.service('iusers');

    const existingPlayer = await iuserService.find({
      query: {
        newPasswordToken: id
      },
      paginete: false
    }) as any;

    if (existingPlayer.total === 0) {
      throwRuleException(PasswordMessage.linkAlteracaoSenhInvalido);
    }

    const dateNow = formatDateServer();
    const dateNewPassword = new Date(existingPlayer.data[0].newPasswordDate);
    dateNewPassword.setMinutes(dateNewPassword.getMinutes() + 10);

    if (dateNewPassword < dateNow) {
      throwRuleException(PasswordMessage.expirrouTempoAlterarSenha);
    }

    if (data.password !== data.confirmPassword) {
      throwRuleException(PasswordMessage.confirmacaoSenhaErrada);
    }

    await iuserService.patch(existingPlayer.data[0].id, {
      password: data.password, newPasswordToken: null, newPasswordDate: null, verifiedEmail: true, verifyToken: null
    }, omit(params, 'provider'));

    return { message: PasswordMessage.senhaAlteradaSucesso };
  }


  private async sendNewPasswordEmail(player: any) {
    const url = `${this.app.get('webURL')}/changePassword?token=${player.newPasswordToken}`;

    const html = `
    <div style="width: 100%; background: #F6F9FB; padding: 32px; font-family: Bahnschrift;">
      <div style="margin: 0 auto; width: 512px; background: #FFF; padding: 16px;">
        <p style="text-align: left;">Ol&aacute; ${player.name},</p>
        <p style="text-align: center;">Voc&ecirc; recentemente pediu a altera&ccedil;&atilde;o da senha. Voc&ecirc; tem 10 minutos para alterar a senha.</p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;"><a style="background: #f1011e; color: white; text-decoration: none; height: 48; padding: 8px 16px; border: 0; border-radius: 8px; font-weight: bold;" href="${url}">Alterar senha</a></p>
      </div>
      <div style="margin: 0 auto; width: 512px; background: #FFF; padding: 16px;"><br />
      <div style="line-height: 0.3; text-align: center;">
        <p style="font-size: 12px; text-align: center;">Se voc&ecirc; n&atilde;o solicitou a altera&ccedil;&atilde;o da senha desconsiderar.</p>
        <p style="font-size: 12px; text-align: center;">Se o link n&atilde;o funcionar copie o endere&ccedil;o abaixo e cole no seu navegador</p>
        <p style="font-size: 12px; text-align: center;"><a href="${url}">${url}</a></p>
          <p style="font-size: 12px; text-align: center;">&nbsp;</p>
      </div>
      </div>
      </div>
    </div>`;
    if (process.env.NODE_ENV !== 'production') {
      player.email = 'your@gmail.com';
    }
    await this.app.service('mailer').create({
      html,
      subject: 'class-coding - Alteração de senha',
      to: player.email,
    });
  }
}
