import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { GroupChallengesStatus } from './group-challenges-status.class';
import hooks from './group-challenges-status.hooks';

declare module '../../declarations' {
  interface IServiceTypes {
    'group-challenges-status': GroupChallengesStatus & ServiceAddons<any>;
  }
}

export default function(app: Application): void {
  app.use('/group-challenges-status', new GroupChallengesStatus(app));
  const service = app.service('group-challenges-status');

  service.hooks(hooks);
}
