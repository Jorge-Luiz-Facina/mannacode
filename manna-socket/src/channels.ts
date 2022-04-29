import { HookContext } from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import { Application } from './declarations';
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function(app: Application): void {
  if (typeof app.channel !== 'function') {
    return;
  }

  app.on('connection', (connection: any): void => {
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    if (connection) {
      app.channel('anonymous').leave(connection);
      app.channel('authenticated').join(connection);
    }
  });

  app.publish((data: any, hook: HookContext) => {
    return app.channel('authenticated');
  });

  app.service('status-challenges').publish('created', (data, context) => {
    return app.channel(`room:${data.applicatorStartId}`).send({
      data
    });
  });

  app.service('status-players').publish('created', (data, context) => {
    return app.channel(`applicator:${data.applicatorStartId}`).send({
      data
    });
  });
}
