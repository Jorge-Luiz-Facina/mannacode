import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ClassPlayer } from './class-player.class';
import hooks from './class-player.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'class-player': ClassPlayer & ServiceAddons<any>;
  }
}

export default async function(app: Application) {
  app.use('/class-player', new ClassPlayer(app));
  const service = app.service('class-player');
  service.hooks(hooks);
}