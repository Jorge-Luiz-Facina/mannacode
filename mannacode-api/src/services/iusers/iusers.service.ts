// Initializes the `users` service on path `/users`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/users.model';
import { IUsers } from './iusers.class';
import hooks from './iusers.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iusers': IUsers & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/iusers', new IUsers(options, app));
  const service = app.service('iusers');
  service.hooks(hooks);
}
