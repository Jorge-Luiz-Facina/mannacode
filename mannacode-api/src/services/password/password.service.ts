import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Password } from './password.class';
import hooks from './password.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'password': Password & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/password', new Password(app));
  const service = app.service('password');
  service.hooks(hooks);
}
