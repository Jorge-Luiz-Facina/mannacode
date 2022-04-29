
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { SendEmailConfirm } from './sendemailconfirm.class';
import hooks from './sendemailconfirm.hooks';


declare module '../../declarations' {
  interface IServiceTypes {
    'sendemailconfirm': SendEmailConfirm & ServiceAddons<any>;
  }
}

export default function(app: Application): void {

  app.use('/sendemailconfirm', new SendEmailConfirm(app));

  const service = app.service('sendemailconfirm');

  service.hooks(hooks);
}
