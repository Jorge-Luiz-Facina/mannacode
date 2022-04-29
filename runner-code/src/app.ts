import { Promise } from 'bluebird';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';

import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import mockClientRedisTest from './redis.helper';

import appHooks from './app.hooks';
import channels from './channels';
import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import { workerStart } from './utils/worker-code-executor';
import { setRedis } from './utils/redist';

// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
// Configure a middleware for 404s and the error handler
app.use(express.notFound());

if (process.env.NODE_ENV === 'development') {
  app.use((err: Error, req: any, res: any, next: any) => {
    logger.error(err.message);
    if (err.stack) {
      logger.error(err.stack);
    }

    next(err);
  });
}

if (process.env.NODE_ENV !== 'test') {
  const client = redis.createClient(app.get('redis'));
  const asyncClient = Promise.promisifyAll(client);
  app.set('redis', asyncClient);
} else {
  app.set('redis', mockClientRedisTest());
}
const redisConect = app.get('redis');
workerStart(redisConect.address, 'Executor', '1', ['Javascript','Java','Python', 'Csharp']);
workerStart(redisConect.address, 'Executor', '2', ['Javascript','Java','Python', 'Csharp']);

app.use(express.errorHandler({ logger } as any));
const queueJson = { queue: '1' }
setRedis(redisConect, `queue`, queueJson);

app.hooks(appHooks);

export default app;
