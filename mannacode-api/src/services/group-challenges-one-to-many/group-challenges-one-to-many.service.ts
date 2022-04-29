import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import hooks from './group-challenges-one-to-many.hooks';
import { GroupChallengesOneToMany } from './group-challenges-one-to-many.class';

declare module '../../declarations' {
  interface IServiceTypes {
    'group-challenges-one-to-many': GroupChallengesOneToMany & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/group-challenges-one-to-many', new GroupChallengesOneToMany(app));
  const service = app.service('group-challenges-one-to-many');
  service.hooks(hooks);
}
