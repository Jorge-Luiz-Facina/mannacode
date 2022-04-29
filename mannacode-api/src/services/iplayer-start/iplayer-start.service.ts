import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/player-start.model';
import { IPlayerStart } from './iplayer-start.class';
import hooks from './iplayer-start.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iplayer-start': IPlayerStart & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/iplayer-start', new IPlayerStart(options, app));
  const service = app.service('iplayer-start');

  service.hooks(hooks);
}
