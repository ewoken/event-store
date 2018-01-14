import enableDestroy from 'server-destroy'

import buildEnvironment from './environment'
import buildApp from './app'

async function launchApp () {
  const environment = await buildEnvironment()
  const app = await buildApp(environment)
  const logger = environment.logger

  const server = app.listen(3000, () => {
    logger.info('Server is listening on', { port: 3000 })
  })
  enableDestroy(server)

  server.on('close', () => {
    environment.close()
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
