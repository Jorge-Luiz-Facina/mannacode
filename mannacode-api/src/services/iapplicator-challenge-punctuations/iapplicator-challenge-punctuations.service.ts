import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/applicator-challenge-punctuations.model';
import { IApplicatorChallengePunctuation } from './iapplicator-challenge-punctuations.class';
import hooks from './iapplicator-challenge-punctuations.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iapplicator-challenge-punctuations': IApplicatorChallengePunctuation & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  app.use('/iapplicator-challenge-punctuations', new IApplicatorChallengePunctuation(options, app));
  const service = app.service('iapplicator-challenge-punctuations');

  service.hooks(hooks);
}
