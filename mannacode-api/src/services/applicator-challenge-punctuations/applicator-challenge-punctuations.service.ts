import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApplicatorChallengePunctuation } from './applicator-challenge-punctuations.class';
import hooks from './applicator-challenge-punctuations.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-challenge-punctuations': ApplicatorChallengePunctuation & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/applicator-challenge-punctuations', new ApplicatorChallengePunctuation(app));
  const service = app.service('applicator-challenge-punctuations');

  service.hooks(hooks);


}
