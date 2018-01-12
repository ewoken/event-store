import config from 'config'

import buildMongoClient from './mongoClient'
import buildAMQPClient from './amqpClient'

async function buildEnvironment () {
  const mongoClient = await buildMongoClient(config.get('mongodb.url'))
  const amqpClient = await buildAMQPClient(config.get('rabbitmq.url'))

  return {
    mongoClient,
    amqpClient,
    close () {
      mongoClient.close()
      amqpClient.connection.close()
    }
  }
}

export default buildEnvironment
