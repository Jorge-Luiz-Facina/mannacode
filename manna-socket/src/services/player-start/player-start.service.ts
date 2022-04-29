import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlayerStart } from './player-start.class';
import hooks from './player-start.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-start': PlayerStart & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/player-start', new PlayerStart(app));
  const service = app.service('player-start');
  service.hooks(hooks);
}
