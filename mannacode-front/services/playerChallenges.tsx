import { post, get } from './base'

export const sendChallenge = async (data) => {
  const value = await post('player-challenges',
    data,
    null,
  );
  return value
}

export const getPlayerChallengeByPlayerStartId = async (data, token) => {
  const value = await get(`player-challenges?page=${data.page}&pageSize=${data.pageSize}&$sort[${data.order.field}]=${data.order.sort}&playerStartId=${data.playerStartId}&groupChallengeId=${data.groupChallengeId}`,
    token,
  );
  return value
}

export const getPlayerChallengeById = async (data, token) => {
  const value = await get(`player-challenges/${data.playerChallengeId}?groupChallengeId=${data.groupChallengeId}`,
    token,
  );
  return value
}