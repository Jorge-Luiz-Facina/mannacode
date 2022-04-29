import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlayerTest } from './player-test.class';
import hooks from './player-test.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-test': PlayerTest & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/player-test', new PlayerTest(app));
  const service = app.service('player-test');
  service.hooks(hooks);
}
