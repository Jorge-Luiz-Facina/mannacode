import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorNextChallenge } from './applicator-next-challenge.class';
import hooks from './applicator-next-challenge.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-next-challenge': ApplicatorNextChallenge & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/applicator-next-challenge', new ApplicatorNextChallenge(app));
  const service = app.service('applicator-next-challenge');
  service.hooks(hooks);
}
