const mailer = require('feathers-mailer'); // tslint:disable-line
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AdapterService } from '../adapter-service';
import hooks from './mailer.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'mailer': AdapterService & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const transporter = {
    auth: {
      pass: app.get('mailer').password,
      user: app.get('mailer').username,
    },
    host: app.get('mailer').host,
    port: app.get('mailer').port,
    requireTLS: true,
    secure: app.get('mailer').secure,
  };

  app.use('mailer', mailer(transporter, { from: app.get('mailer').from }));

  const service = app.service('mailer');

  service.hooks(hooks);
}
