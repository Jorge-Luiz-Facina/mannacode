import { disallow, fastJoin } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { acessExternal } from '../../utils/acess-external';


const { authenticate } = feathersAuthentication.hooks;

const resolver = {
  joins: {
    team: () => async (group: any, context: HookContext) => {
      const id = context.id === undefined ? group.id : context.id;
      const challengesService = context.app.service('ichallenges');
      const challenges = await challengesService.find(acessExternal({
        query: { groupChallengeId: id },
      }));

      group.challenges = challenges.data;
    }
  }
};
export default {
  before: {
    all: [authenticate('jwt')],
    find: [disallow()],
    get: [],
    create: [],
    update: [disallow()],
    patch: [],
    remove: []
  },
  after: {
    all: [fastJoin(resolver)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
