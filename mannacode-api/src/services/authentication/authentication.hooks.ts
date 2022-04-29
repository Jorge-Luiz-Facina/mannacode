import * as local from '@feathersjs/authentication-local';

const { protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ ],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [
      protect('authentication')
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
