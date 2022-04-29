import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorStartSocket } from './applicator-start-socket.class';
import hooks from './applicator-start-socket.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-start-socket': ApplicatorStartSocket & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/applicator-start-socket', new ApplicatorStartSocket(app));

  const service = app.service('applicator-start-socket');

  service.hooks(hooks);
}
