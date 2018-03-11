import express from 'express';

// middlewares
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import {
  errorHandlerMiddleware,
  logRequestMiddleware,
  addRequestIdMiddleware,
  notFoundMiddleware,
  debug as debugMiddleware,
} from '@ewoken/backend-common/lib/api/customMiddleWares';

import buildEventApi from './eventApi';

function buildApi({ logger }, { eventService }) {
  const app = express();

  // TODO session

  app.use(addRequestIdMiddleware());
  app.use(helmet());
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(debugMiddleware());

  app.use('/events', buildEventApi(eventService));

  app.use(notFoundMiddleware());
  app.use(errorHandlerMiddleware(logger));
  app.use(logRequestMiddleware(logger));

  return app;
}

export default buildApi;
