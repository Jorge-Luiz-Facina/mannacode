import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/challenges.model';
import { IChallenges } from './ichallenges.class';
import hooks from './ichallenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'ichallenges': IChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/ichallenges', new IChallenges(options, app));
  const service = app.service('ichallenges');

  service.hooks(hooks);
}
