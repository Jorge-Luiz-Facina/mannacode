import { Worker } from 'code-executor';
var path = require('path');


export const workerStart = async (redisAddress, name, id, languages: string[]) => {
  var appDir = path.dirname(require.main?.path);

  const worker = new Worker(`${name}/${id}`, `redis://${redisAddress}`, {
    folderPath: `${appDir}/codetmp`,
    memory: 100,
    CPUs: 1,
  });
  await worker.build(languages);
  worker.start();
};

export const workerPause = async (redisAddress, name, id) => {
  var appDir = path.dirname(require.main?.path);

  const worker = new Worker(`${name}/${id}`, `redis://${redisAddress}`, {
    folderPath: `${appDir}/codetmp`,
    memory: 0,
    CPUs: 1,
  });
  worker.stop();
};
