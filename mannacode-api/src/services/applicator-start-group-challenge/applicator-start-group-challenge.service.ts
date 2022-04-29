import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorStartGroupChallenge } from './applicator-start-group-challenge.class';
import hooks from './applicator-start-group-challenge.hooks';
import createModel from '../../models/applicator-start-group-challenge';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-start-group-challenge': ApplicatorStartGroupChallenge & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  app.use('/applicator-start-group-challenge', new ApplicatorStartGroupChallenge(options, app));

  const service = app.service('applicator-start-group-challenge');

  service.hooks(hooks);
}