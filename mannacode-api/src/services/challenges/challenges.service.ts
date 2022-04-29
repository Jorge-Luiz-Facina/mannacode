import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Challenges } from './challenges.class';
import hooks from './challenges.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'challenges': Challenges & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/challenges', new Challenges(app));
  const service = app.service('challenges');
  service.hooks(hooks);
}
