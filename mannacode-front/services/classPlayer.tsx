import { patch, get as baseGet, post } from './base'


export const get = async (data) => {
  const value = await baseGet(`class-player?page=${data.page}&pageSize=${data.pageSize}&type=${data.type}&$sort[${data.order.field}]=${data.order.sort}&token=${data.token}`,
    null);
  return value;
}

export const getChallenges = async (data) => {
  const value = await post(`class-player?$sort[${data.order.field}]=${data.order.sort}`,
    data, null);
  return value;
};

export const getChallenge = async (id, token) => {
  const value = await baseGet(`class-player/${id}?token=${token}`, null);
  return value;
};

export const sendChallengeSolo = async (id, data) => {
  const value = await patch(`class-player/${id}`, data,
    null);
  return value;
}