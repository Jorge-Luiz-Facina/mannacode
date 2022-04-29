import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Verify } from './verify.class';
import hooks from './verify.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'verify': Verify & ServiceAddons<any>;
  }
}

export default function(app: Application): void {

  app.use('/verify', new Verify(app));

  const service = app.service('verify');

  service.hooks(hooks);
}