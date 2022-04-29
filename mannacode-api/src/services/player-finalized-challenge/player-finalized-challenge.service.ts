import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlayerFinalizedChallenge } from './player-finalized-challenge.class';
import hooks from './player-finalized-challenge.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-finalized-challenge': PlayerFinalizedChallenge & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/player-finalized-challenge', new PlayerFinalizedChallenge(app));
  const service = app.service('player-finalized-challenge');
  service.hooks(hooks);
}
