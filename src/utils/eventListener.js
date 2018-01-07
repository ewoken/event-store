import { EventEmitter } from 'events'
import config from 'config'
import redis from 'redis'
import logger from 'winston'
import bluebird from 'bluebird'

async function buildEventListener () {
  const eventListener = new EventEmitter()
  const redisClient = redis.createClient(config.get('redis'))
  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)

  redisClient.on('error', (err) => {
    logger.error(err)
  })

  redisClient.on('pmessage', (pattern, channel, message) => {
    eventListener.emit('event', JSON.parse(message))
  })

  await redisClient.psubscribeAsync('events.*')

  eventListener.destroy = () => {
    redisClient.end(false)
  }

  return eventListener
}

export default buildEventListener
