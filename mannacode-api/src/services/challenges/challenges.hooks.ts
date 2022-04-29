import { disallow } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';


const { authenticate } = feathersAuthentication.hooks;
const notPermission = async context => {
  const challengesService = context.app.service('challenges');
  await challengesService.get(context.id, context.params);
};
export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [disallow()],
    patch: [notPermission],
    remove: [notPermission]
  },
  after: {
    all: [],
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
