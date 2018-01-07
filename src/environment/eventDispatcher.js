import config from 'config'
import redis from 'redis'
import logger from 'winston'
import bluebird from 'bluebird'

async function buildEventDispatcher () {
  const redisClient = redis.createClient(config.get('eventDispatcher'))
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)

  redisClient.on('error', (err) => {
    logger.error(err)
  })

  function dispatch (event) {
    const { entityType, entityId, type } = event
    const userId = event.userId === null
      ? '_'
      : event.userId
    const channel = `events.${userId}.${entityType}.${type}.${entityId}`
    return redisClient
      .publishAsync(channel, JSON.stringify(event))
  }

  return {
    dispatch,
    close: () => redisClient.end(false)
  }
}

export default buildEventDispatcher
