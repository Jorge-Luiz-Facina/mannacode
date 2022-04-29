import { Params } from '@feathersjs/feathers';
import { omit } from 'lodash';

export const acessExternal = (params: Params = {}) => {
  return omit(params, 'provider');
};
