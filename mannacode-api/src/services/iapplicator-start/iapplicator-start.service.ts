import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/applicator-start.model';
import { IApplicatorStart } from './iapplicator-start.class';
import hooks from './iapplicator-start.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iapplicator-start': IApplicatorStart & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/iapplicator-start', new IApplicatorStart(options, app));
  const service = app.service('iapplicator-start');
  service.hooks(hooks);
}
