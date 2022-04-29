import { post, patch, get, remove as baseRemove } from './base'

export const keyPlayer = async (data) => {
  const value = await post('player-start',
    data,
    null,
  );
  return value;
}

export const playerName = async (id, name) => {
  const value = await patch(`player-start/${id}`,
    { name: name },
    null,
  );
  return value;
}

export const getChallenge = async (id, data) => {
  const value = await patch(`status-challenges/${id}`,
    {
      playerId: data.playerId,
      token: data.token
    },
    null,
  );
  return value;
}

export const getPlayersByApplicatorStartId = async (data, token) => {
  const value = await get(`player-start?page=${data.page}&pageSize=${data.pageSize}&$sort[${data.order.field}]=${data.order.sort}&groupChallengeId=${data.groupChallengeId}`,
    token
  );
  return value;
}

export const remove = async (id, token) => {
  const value = await baseRemove(`player-start/${id}`,
    token,
  );
  return value;
}