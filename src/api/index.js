import express from 'express'

// middlewares
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import {
  errorHandlerMiddleware,
  logRequestMiddleware,
  addRequestId
} from '@ewoken/backend-common/lib/api/customMiddleWares'

import buildEventApi from './eventApi'

function buildApi (environment, { eventService }) {
  const logger = environment.logger
  const app = express()

  app.use(addRequestId())
  app.use(helmet())
  app.use(compression())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/events', buildEventApi(eventService))

  app.use(errorHandlerMiddleware(logger))
  app.use(logRequestMiddleware(logger))

  return app
}

export default buildApi
