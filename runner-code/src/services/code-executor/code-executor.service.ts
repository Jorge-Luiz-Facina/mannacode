import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CodeExecutor } from './code-executor.class';
import hooks from './code-executor.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'code-executor': CodeExecutor & ServiceAddons<any>;
  }
}

export default async function(app: Application) {
  app.use('/code-executor', new CodeExecutor(app));
  const service = app.service('code-executor');
  service.hooks(hooks);
}
