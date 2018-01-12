import { EventEmitter } from 'events'
import config from 'config'
// import redis from 'redis'
import logger from 'winston'
// import bluebird from 'bluebird'
import amqp from 'amqplib'

/* async function buildEventListener () {
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
} */

async function buildEventListener () {
  const eventListener = new EventEmitter()
  const connection = await amqp.connect(config.get('rabbitmq.url'))
  const channel = await connection.createChannel()
  const eventExchange = config.get('rabbitmq.eventExchange')

  channel.on('error', error => {
    logger.error(error)
  })

  channel.assertExchange(eventExchange, 'topic', { durable: false })
  const queue = await channel.assertQueue('', { exclusive: true })

  channel.bindQueue(queue.queue, eventExchange, '#')
  channel.consume(queue.queue, message => {
    const eventJSON = message.content.toString()
    eventListener.emit('event', JSON.parse(eventJSON))
  })

  eventListener.destroy = () => {
    connection.close()
  }
  return eventListener
}

export default buildEventListener
