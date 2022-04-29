/* eslint-disable no-irregular-whitespace */
import { throwRuleException } from '../../utils/exception';
import { Application } from '../../declarations';
import { AdapterService } from '../adapter-service';
import { Params } from '@feathersjs/feathers';
import { IUsersMessage } from '../iusers/iusers.message';

export class Verify extends AdapterService​​ {

  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(data: Partial<any>, params?: Params): Promise<any> {
    try {
      const { token } = data;

      if (!token) {
        throwRuleException(IUsersMessage.linkVerificacaoEmailInvalido);
      }

      const users = await this.app.service('users').find({
        query: {
          verifyToken: token,
        },
      });

      if ( users.total > 1) {
        throwRuleException(IUsersMessage.linkVerificacaoEmailDuplicado);
      }
      if (users.total === 0 ) {
        throwRuleException(IUsersMessage.linkVerificacaoEmailNaoExiste);
      }

      const user = users.data[0];
      await this.app.service('iusers').patch(user.id, {
        verifyToken: null,
        verifiedEmail: true,
      });

      return { ok: true };
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
