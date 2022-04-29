import { post } from './base'

export const sendPunctuation = async (data) => {
  const value = await post('player-challenge-punctuations',
    data,
    null,
  );
  return value
}