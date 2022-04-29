import { post } from './base'

export const create = async (data, token) => {
  const value = await post('applicator-next-challenge', data,
    token);
  return value;
};