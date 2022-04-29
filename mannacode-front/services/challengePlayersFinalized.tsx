import { patch, get as baseGet, post} from './base'

export const getPunctuationTotal = async (token) => {
  const value = await baseGet(`challenge-players-finalized/${token}`, null);
  return value;
};

export const getPlayersFinalizedChallenge = async (data, token) => {
  const value = await baseGet(`challenge-players-finalized?page=${data.page}&pageSize=${data.pageSize}&$sort[${data.order.field}]=${data.order.sort}&challengeId=${data.challengeId}&token=${token}`, null);
  return value;
};

export const getPunctuationPlayersFinalizedActivitie = async (data) => {
  const value = await post('challenge-players-finalized', data, null);
  return value;
};

export const getPunctuationPlayersFinalized = async (data, token) => {
  const value = await patch(`challenge-players-finalized/${token}`, data, null);
  return value;
};

export const getPunctuationPlayersFinalizedActivitieApplicator = async (data, token) => {
  const value = await post('challenge-players-finalized', data, token);
  return value;
};
