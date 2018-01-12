import enableDestroy from 'server-destroy'

import logger from './logger'
import buildApp from './app'

logger.info('NODE_ENV =', { env: process.env.NODE_ENV })

async function launchApp () {
  const app = await buildApp()
  const server = app.listen(3000, () => {
    logger.info('Server is listening on', { port: 3000 })
  })
  enableDestroy(server)

  server.on('close', () => {
    app.close()
    logger.info('Server closed')
  })

  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())

  return server
}

if (require.main === module) {
  launchApp()
}

export default launchApp
