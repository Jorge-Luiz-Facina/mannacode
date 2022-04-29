import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorStartSolo } from './applicator-start-solo.class';
import hooks from './applicator-start-solo.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-start-solo': ApplicatorStartSolo & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/applicator-start-solo', new ApplicatorStartSolo(app));

  const service = app.service('applicator-start-solo');

  service.hooks(hooks);
}
