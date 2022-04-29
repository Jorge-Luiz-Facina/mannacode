import { patch, post } from './base'

export const loginPlayer = async (data) => {
  const value = await post('authentication-player', data, null);
  return value;
};

export const reSendEmail = async (id, token) => {
  const value = await patch(`authentication-player/${id}`, {}, token);
  return value;
};