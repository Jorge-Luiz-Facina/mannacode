import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { NextPlayerChallenges } from './next-player-challenges.class';
import hooks from './next-player-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'next-player-challenges': NextPlayerChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/next-player-challenges', new NextPlayerChallenges(app));
  const service = app.service('next-player-challenges');
  service.hooks(hooks);
}
