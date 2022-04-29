import { post } from './base'

export const nextPlayerChallenge = async (data, token) => {
  const value = await post('next-player-challenges',
    data,
    token,
  );
  return value
}