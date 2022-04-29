import { get as baseGet } from './base'

export const getPlayerFinalizedChallenge = async (data, token) => {
  const value = await baseGet(`player-finalized-challenge/${token}?challengeId=${data.challengeId}&playerId=${data.playerId}&groupChallengeId=${data.groupChallengeId}`, null);
  return value;
};