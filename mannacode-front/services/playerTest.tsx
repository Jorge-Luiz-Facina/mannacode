import { post, patch} from './base'

export const playerTest = async (data) => {
  const value = await post('player-test',
    data,
    null,
  );
  return value;
}

export const playerTestSolo = async (id, data) => {
  const value = await patch(`player-test/${id}`,
    data,
    null,
  );
  return value;
}