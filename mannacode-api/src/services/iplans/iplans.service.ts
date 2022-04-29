import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/plans.model';
import { Iplans } from './iplans.class';
import hooks from './iplans.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'iplans': Iplans & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/iplans', new Iplans(options, app));
  const service = app.service('iplans');

  service.hooks(hooks);
}
