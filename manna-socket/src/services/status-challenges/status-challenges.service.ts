import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { StatusChallenge } from './status-challenges.class';
import hooks from './status-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'status-challenges': StatusChallenge & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/status-challenges', new StatusChallenge(app));

  const service = app.service('status-challenges');

  service.hooks(hooks);
}
