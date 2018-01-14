import config from 'config'

import buildMongoClient from './mongoClient'
import buildAMQPClient from './amqpClient'
import logger from './logger'

async function buildEnvironment () {
  logger.info('Building environment...')
  const mongoClient = await buildMongoClient(config.get('mongodb.url'))
  const amqpClient = await buildAMQPClient(config.get('rabbitmq.url'))

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
