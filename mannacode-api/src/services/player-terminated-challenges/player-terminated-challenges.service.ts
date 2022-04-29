import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/player-terminated-challenges.model';
import { PlayerTerminetedChallenges } from './player-terminated-challenges.class';
import hooks from './player-terminated-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-terminated-challenges': PlayerTerminetedChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/player-terminated-challenges', new PlayerTerminetedChallenges(options, app));
  const service = app.service('player-terminated-challenges');

  service.hooks(hooks);
}
