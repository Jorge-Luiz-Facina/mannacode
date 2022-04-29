import { disallow } from 'feathers-hooks-common';
import * as authentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';


const { authenticate } = authentication.hooks;
const { protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [],
    update: [disallow()],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      protect('password', 'verifyToken', 'newPasswordToken', 'newPasswordDate')
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
