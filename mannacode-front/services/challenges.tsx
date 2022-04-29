import { patch, post, get as baseGet, remove as baseRemove } from './base'

export const create = async (data, token) => {
  const value = await post('challenges', data,
    token);
  return value;
};

export const updateIndex = async (id, data, token) => {
  const value = await patch(`group-challenges-one-to-many/${id}`, data,
    token);
  return value;
};


export const updateChallenge = async (id, data, token) => {
  const value = await patch(`challenges/${id}`, data,
    token);
  return value;
};

export const get = async (id, token) => {
  const value = await baseGet(`challenges/${id}`,
    token);
  return value;
};

export const remove = async (id, token) => {
  const value = await baseRemove(`challenges/${id}`,
    token);
  return value;
};

export const myChallenges = async (data, groupChallengeId, token) => {
  const value = await baseGet(`challenges?page=${data.page}&pageSize=${data.pageSize}&groupChallengeId=${groupChallengeId}&$sort[${data.order.field}]=${data.order.sort}`,
    token);
  return value;
};