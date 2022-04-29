import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { applicatorPlayerFinalizedChallenge } from './applicator-player-finalized-challenge.class';
import hooks from './applicator-player-finalized-challenge.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'applicator-player-finalized-challenge': applicatorPlayerFinalizedChallenge & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/applicator-player-finalized-challenge', new applicatorPlayerFinalizedChallenge(app));
  const service = app.service('applicator-player-finalized-challenge');
  service.hooks(hooks);
}
