
/* eslint-disable no-useless-catch */
export const setRedis = async (cacheClient, key, value) => {
  try {
    await cacheClient.setAsync(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    throw error;
  }
  try {
    return await cacheClient.setAsync(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    throw error;
  }
};

export const getRedis = async (cacheClient, key) => {
  try {
    return await cacheClient.getAsync(key);
  } catch (error) {
    throw error;
  }
};

export const delRedis = async (cacheClient, key) => {
  try {
    await cacheClient.delAsync(key);
  } catch (error) {
    throw error;
  }
};
