import { get as baseGet, post, patch, remove as baseRemove } from './base'

export const myGroupChallenges = async (data, token) => {
  const value = await baseGet(`group-challenges?page=${data.page}&pageSize=${data.pageSize}&type=${data.type}&$sort[${data.order.field}]=${data.order.sort}`,
    token);
  return value;
};


export const create = async (data, token) => {
  const value = await post('group-challenges', data,
    token);
  return value;
};

export const get = async (id, token) => {
  const value = await baseGet(`group-challenges/${id}`,
    token);
  return value;
};

export const update = async (id, data, token) => {
  const value = await patch(`group-challenges/${id}`, data,
    token);
  return value;
};

export const remove = async (id, token) => {
  const value = await baseRemove(`group-challenges/${id}`,
    token);
  return value;
};

export const getGroupChallengesStatusIsNotEnd = async (token) => {
  const value = await baseGet('group-challenges-status?',
    token);
  return value;
};

export const myGroupChallengeByApplicatorStartId = async (data, token) => {
  const value = await post(`group-challenges-status?$sort[${data.order.field}]=${data.order.sort}`,
    data,
    token);
  return value;
};