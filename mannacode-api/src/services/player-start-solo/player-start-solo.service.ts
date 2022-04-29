import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlayerStartSolo } from './player-start-solo.class';
import hooks from './player-start-solo.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-start-solo': PlayerStartSolo & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/player-start-solo', new PlayerStartSolo(app));
  const service = app.service('player-start-solo');
  service.hooks(hooks);
}
