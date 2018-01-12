import express from 'express'
import uuid from 'uuid'

// middlewares
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import logger from './logger'
import buildEnvironment from './environment'
import initServices from './services'
import buildApi from './api'

async function buildApp () {
  const app = express()
  const environment = await buildEnvironment()
  const services = await initServices(environment)

  app.use(helmet())
  app.use(compression())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  buildApi(app, services)

  // error handler middleware
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.statusCode = 400
      res.json({ error: err.message })
    } else {
      switch (err.name) {
        case 'ValidationError':
          res.statusCode = 400
          res.json({ error: err.message })
          break
        default:
          const errorId = uuid()
          logger.error(errorId, err)
          res.statusCode = 500
          res.json({ error: `${errorId}` })
      }
    }

    next()
  })

  app.close = () => {
    environment.close()
  }

  return app
}

export default buildApp
