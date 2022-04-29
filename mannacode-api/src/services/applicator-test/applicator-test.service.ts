import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorTest } from './applicator-test.class';
import hooks from './applicator-test.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-test': ApplicatorTest & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/applicator-test', new ApplicatorTest(app));

  const service = app.service('applicator-test');

  service.hooks(hooks);
}
