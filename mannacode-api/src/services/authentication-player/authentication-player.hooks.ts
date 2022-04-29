import { disallow } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';


const { authenticate } = feathersAuthentication.hooks;
export default {
  before: {
    all: [],
    find: [disallow()],
    get: [],
    create: [],
    update: [disallow()],
    patch: [authenticate('jwt')],
    remove: [disallow()]
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
