import { patch, get as baseGet, post, remove as baseRemove} from './base'

export const create = async (data, token) => {
  const value = await post('applicator-start-solo', data,
    token);
  return value;
};

export const update = async (id, data, token) => {
  const value = await patch(`applicator-start-solo/${id}`, data,
    token);
  return value;
};

export const get = async (id, token) => {
  const value = await baseGet(`applicator-start-solo/${id}`,
    token);
  return value;
};

export const remove = async (id, token) => {
  const value = await baseRemove(`applicator-start-solo/${id}`,
    token);
  return value;
};