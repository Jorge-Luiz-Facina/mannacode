import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorStart } from './applicator-start.class';
import hooks from './applicator-start.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-start': ApplicatorStart & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/applicator-start', new ApplicatorStart(app));

  const service = app.service('applicator-start');

  service.hooks(hooks);
}
