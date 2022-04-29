import { patch, get, post} from './base'


export const sendActivitiesToClass = async (data, token) => {
  const value = await post('applicator-start', data,
    token);
  return value;
};

export const startRoom = async (id, data, token) => {
  const value = await patch(`applicator-start/${id}`, data,
    token);
  return value;
};

export const getApplicatorStartByGroupChallengeId = async (data, token) => {
  const value = await get(`applicator-start-socket?groupChallengeId=${data.groupChallengeId}`,
    token);
  return value;
};

export const getApplicatorclass = async (data, token) => {
  const value = await get(`applicator-start?type=${data.type}`,
    token);
  return value;
};