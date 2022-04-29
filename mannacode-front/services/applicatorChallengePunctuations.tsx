import { post } from './base'

export const sendPunctuation = async (data, token) => {
  const value = await post('applicator-challenge-punctuations',
    data,
    token,
  );
  return value
}