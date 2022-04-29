import * as feathersAuthentication from '@feathersjs/authentication';
import { disallow } from 'feathers-hooks-common';
import * as local from '@feathersjs/authentication-local';

const { protect } = local.hooks;
const { authenticate } = feathersAuthentication.hooks;
export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [protect('key')],
    create: [],
    update: [disallow()],
    patch: [disallow('external')],
    remove: [authenticate('jwt')]
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
