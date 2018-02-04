import config from 'config'
import logger from '@ewoken/backend-common/lib/logger'

import buildMongoClient from './mongoClient'
import buildAMQPClient from './amqpClient'

async function buildEnvironment () {
  logger.info('Building environment...')
  const mongoClient = await buildMongoClient(config.get('mongodb.url'))
  const amqpClient = await buildAMQPClient({
    url: config.get('rabbitmq.url'),
    logger
  })

  return {
    mongoClient,
    amqpClient,
    logger,
    close () {
      mongoClient.close()
      amqpClient.connection.close()
    }
  }
}

export default buildEnvironment
