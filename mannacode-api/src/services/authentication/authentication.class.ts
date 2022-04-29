import { AuthenticationRequest } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { Params } from '@feathersjs/feathers';
import { throwRuleException } from '../../utils/exception';

import { omit } from 'lodash';
import { acessExternal } from '../../utils/acess-external';

export class CustomLocalStrategy extends LocalStrategy {

  public async authenticate(data: AuthenticationRequest, params: Params): Promise<{
    [x: number]: any;
    authentication: {
      strategy: string;
    }
  }> {
    const { passwordField, usernameField, entity } = this.configuration;
    const username = data[usernameField];
    const password = data[passwordField];
    const result = await this.findEntity(username, acessExternal(params));

    if (!result.verifiedEmail) {
      throwRuleException('Você precisa verificar e-mail');
    }

    await this.comparePassword(result, password);

    return {
      authentication: { strategy: this.name as string },
      [entity]: omit(await this.getEntity(result, acessExternal(params)), ['password'], ['verifyToken'])
    };
  }
}
