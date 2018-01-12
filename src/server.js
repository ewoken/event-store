import logger from 'winston'
import enableDestroy from 'server-destroy'

import buildApp from './app'

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

if (require.main === module) {
  launchApp()
}

export default launchApp
