import config from 'config'
import redis from 'redis'
import logger from 'winston'
import bluebird from 'bluebird'

async function buildRedisClient () {
  const redisClient = redis.createClient(config.get('redis'))
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)

  redisClient.on('error', (err) => {
    logger.error(err)
  })

  return redisClient
}

export default buildRedisClient
