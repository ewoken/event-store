import express from 'express'
import logger from 'winston'
import uuid from 'uuid'

// middlewares
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import enableDestroy from 'server-destroy'

import buildEnvironment from './environment'
import buildEventApi from './event'

async function buildApp () {
  const app = express()
  const environment = await buildEnvironment()
  const eventApi = buildEventApi(environment)

  app.use(helmet())
  app.use(compression())
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/events', eventApi)

  // error handler middleware
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      res.status(400)
      res.json({ error: err.message })
      next()
    }

    switch (err.name) {
      case 'ValidationError':
        res.status(400)
        res.json({ error: err.message })
        break
      default:
        const errorId = uuid()
        logger.error(errorId, err)
        res.status(500)
        res.json({ error: `${errorId}` })
    }
    next()
  })

  app.close = () => {
    environment.close()
  }

  return app
}

async function launchApp () {
  const app = await buildApp()
  const server = app.listen(3000, () => {
    logger.info('Server is listening on 3000')
  })
  enableDestroy(server)

  server.on('close', () => {
    logger.info('close')
    app.close()
  })

  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())

  return server
}

export default launchApp
