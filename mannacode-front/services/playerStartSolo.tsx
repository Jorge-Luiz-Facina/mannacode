import { patch, get as baseGet, post, remove as baseRemove} from './base'

export const create = async (data, token) => {
  const value = await post('player-start-solo', data,
    token);
  return value;
};

export const update = async (id, data, token) => {
  const value = await patch(`player-start-solo/${id}`, data,
    token);
  return value;
};

export const remove = async (id, token) => {
  const value = await baseRemove(`player-start-solo/${id}`,
    token);
  return value;
};

export const getPlayers = async (data, token) => {
  const value = await baseGet(`player-start-solo?page=${data.page}&pageSize=${data.pageSize}&type=${data.type}&$sort[${data.order.field}]=${data.order.sort}&applicatorStartId=${data.applicatorStartId}`,
    token);
  return value;
};

export const getPlayer = async (id, token) => {
  const value = await baseGet(`player-start-solo/${id}`,
    token);
  return value;
};