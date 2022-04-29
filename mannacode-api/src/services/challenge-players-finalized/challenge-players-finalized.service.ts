import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { challengePlayersFinalized } from './challenge-players-finalized.class';
import hooks from './challenge-players-finalized.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'challenge-players-finalized': challengePlayersFinalized & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/challenge-players-finalized', new challengePlayersFinalized(app));
  const service = app.service('challenge-players-finalized');
  service.hooks(hooks);
}
