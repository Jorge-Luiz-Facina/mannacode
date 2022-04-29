import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Plans } from './plans.class';
import hooks from './plans.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'plans': Plans & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/plans', new Plans(app));
  const service = app.service('plans');

  service.hooks(hooks);
}
