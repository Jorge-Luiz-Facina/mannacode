import { get } from './base';

export const getPlayersRoom = async (id, token) => {
  const value = await get(`status-players/${id}`, token);
  return value
}