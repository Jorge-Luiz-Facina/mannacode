import { disallow, lowerCase } from 'feathers-hooks-common';
import * as local from '@feathersjs/authentication-local';


const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [ hashPassword('password'), lowerCase('email')],
    update: [disallow()],
    patch: [hashPassword('password')],
    remove: []
  },
  after: {
    all: [
      protect('password')
    ],
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
