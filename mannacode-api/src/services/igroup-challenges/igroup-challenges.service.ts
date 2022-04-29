import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/group-challenges.model';
import { IGroupChallenges } from './igroup-challenges.class';
import hooks from './igroup-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'igroup-challenges': IGroupChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/igroup-challenges', new IGroupChallenges(options, app));
  const service = app.service('igroup-challenges');

  service.hooks(hooks);
}
