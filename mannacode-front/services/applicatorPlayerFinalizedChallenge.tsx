import { patch, get as baseGet, post} from './base'

export const findPlayerFinalizedChallengesByChallengeId = async (data, token) => {
  const value = await baseGet(`applicator-player-finalized-challenge?page=${data.page}&pageSize=${data.pageSize}&$sort[${data.order.field}]=${data.order.sort}&challengeId=${data.challengeId}`,
    token);
  return value;
}

export const getPlayerFinalizedChallenge = async (id, token) => {
  const value = await baseGet(`applicator-player-finalized-challenge/${id}`,
    token);
  return value;
};

export const setPunctuationPlayerFinalizedChallenge = async (data, token) => {
  const value = await post('applicator-player-finalized-challenge/', data,
    token);
  return value;
};

export const updatePunctuationPlayerFinalizedChallenge = async (id, data, token) => {
  const value = await patch(`applicator-player-finalized-challenge/${id}`, data,
    token);
  return value;
};