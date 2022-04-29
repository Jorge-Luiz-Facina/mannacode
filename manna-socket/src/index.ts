import cluster from 'cluster';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import os from 'os'

import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';

import appHooks from './app.hooks';
import channels from './channels';
import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';

// Don't remove this comment. It's needed to format import lines nicely.

if (cluster.isMaster) {
  const cpus = process.env.NODE_ENV !== 'production' ? 2 : os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
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
  app.configure(socketio({
    transports: ['websocket']
  }));

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

  app.use(express.errorHandler({ logger } as any));

  app.hooks(appHooks);
  logger.info('Feathers application started on http://%s:%d', app.get('host'), '4000')

  app.listen(4000);
}
