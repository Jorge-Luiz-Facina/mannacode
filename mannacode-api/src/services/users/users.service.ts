import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Users } from './users.class';
import hooks from './users.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'users': Users & ServiceAddons<any>;
  }
}

export default function(app: Application) {
  app.use('/users', new Users(app));

  const service = app.service('users');

  service.hooks(hooks);
}
