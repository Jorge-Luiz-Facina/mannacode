
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { expressOauth } from '@feathersjs/authentication-oauth';
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CustomLocalStrategy } from './authentication.class';
import hooks from './authentication.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new CustomLocalStrategy());
  app.use('/authentication', authentication);
  app.configure(expressOauth());
  const service = app.service('authentication');
  service.hooks(hooks);
}
