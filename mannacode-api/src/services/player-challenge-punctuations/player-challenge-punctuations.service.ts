import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/player-challenge-punctuations.model';
import { PlayerChallengePunctuation } from './player-challenge-punctuations.class';
import hooks from './player-challenge-punctuations.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'player-challenge-punctuations': PlayerChallengePunctuation & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/player-challenge-punctuations', new PlayerChallengePunctuation(options, app));
  const service = app.service('player-challenge-punctuations');

  service.hooks(hooks);
}
