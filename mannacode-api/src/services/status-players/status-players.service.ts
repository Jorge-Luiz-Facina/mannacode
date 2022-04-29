import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { StatusPlayer } from './status-players.class';
import hooks from './status-players.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'status-players': StatusPlayer & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/status-players', new StatusPlayer(app));

  const service = app.service('status-players');

  service.hooks(hooks);
}
