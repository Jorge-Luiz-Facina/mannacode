import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlayerChallenges } from './player-challenges.class';
import hooks from './player-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-challenges': PlayerChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/player-challenges', new PlayerChallenges(app));
  const service = app.service('player-challenges');
  service.hooks(hooks);
}
