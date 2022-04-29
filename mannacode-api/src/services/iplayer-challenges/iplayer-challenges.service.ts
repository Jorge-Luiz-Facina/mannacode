import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/player-challenges.model';
import { IPlayerChallenges } from './iplayer-challenges.class';
import hooks from './iplayer-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iplayer-challenges': IPlayerChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/iplayer-challenges', new IPlayerChallenges(options, app));
  const service = app.service('iplayer-challenges');

  service.hooks(hooks);
}
