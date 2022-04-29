import { Promise } from 'bluebird';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';

import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import mockClientRedisTest from './redis.helper';

import appHooks from './app.hooks';
import authentication from './services/authentication/authentication.service';
import channels from './channels';
import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import sequelize from './sequelize';
import services from './services';

const app: Application = express(feathers());

app.configure(configuration());
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(app.get('public')));
app.configure(express.rest());
app.configure(socketio());
app.configure(sequelize);
app.configure(middleware);
app.configure(authentication);
app.configure(services);
app.configure(channels);
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

app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
