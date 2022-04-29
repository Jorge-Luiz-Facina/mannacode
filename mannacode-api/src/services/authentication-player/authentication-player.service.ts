import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AuthenticationPlayer } from './authentication-player.class';
import hooks from './authentication-player.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'authentication-player': AuthenticationPlayer & ServiceAddons<any>;
  }
}

export default async function(app: Application) {
  app.use('/authentication-player', new AuthenticationPlayer(app));
  const service = app.service('authentication-player');
  service.hooks(hooks);
}