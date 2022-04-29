import { post } from './base'

export const test = async (data, token) => {
  const value = await post('applicator-test', data,
    token);
  return value;
};