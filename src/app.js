import express from 'express'
import uuid from 'uuid'

// middlewares
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import initServices from './services'
import buildApi from './api'

async function buildApp (environment) {
  const logger = environment.logger
  const app = express()
  const services = await initServices(environment)

  app.use((req, res, next) => {
    req.requestId = uuid()
    next()
  })
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
          logger.error(err.stack, { requestId: req.requestId })
          res.statusCode = 500
          res.json({ error: `${req.requestId}` })
      }
    }

    next()
  })

  app.use((req, res, next) => {
    const message = `${res.statusCode} ${req.method} ${req.originalUrl}`
    const data = {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      headers: req.headers,
      body: req.body
    }
    if (res.statusCode === 500) {
      logger.error(message, data)
    } else {
      logger.info(message, data)
    }
    next()
  })

  return app
}

export default buildApp
