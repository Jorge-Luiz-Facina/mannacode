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
}
