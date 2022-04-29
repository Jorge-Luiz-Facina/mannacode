import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { GroupChallenges } from './group-challenges.class';
import hooks from './group-challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'group-challenges': GroupChallenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/group-challenges', new GroupChallenges(app));
  const service = app.service('group-challenges');

  service.hooks(hooks);
}
