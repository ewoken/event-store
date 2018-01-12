import { EventEmitter } from 'events'
import config from 'config'

class EventConsumer {
  constructor ({ eventExchange, eventQueue }) {
    this.eventEmitter = new EventEmitter()
    this.eventExchange = eventExchange
    this.eventQueue = eventQueue
    this.amqpClient = null
  }

  async init (amqpClient) {
    this.amqpClient = amqpClient
    amqpClient.assertExchange(this.eventExchange, 'topic', { durable: false })
    const queue = await amqpClient.assertQueue(this.eventQueue, { exclusive: false })

    amqpClient.bindQueue(queue.queue, this.eventExchange, '#')
    amqpClient.consume(queue.queue, message => {
      this.eventEmitter.emit('message', message)
    })
  }

  onEvent (listener) {
    this.eventEmitter.on('message', message => {
      const event = JSON.parse(message.content.toString())
      listener(event)
        .then(() => this.amqpClient.ack(message), () => this.amqpClient.nack(message))
    })
  }
}

const eventExchange = config.get('eventService.eventExchange')
const eventQueue = config.get('eventService.eventQueue')
export default new EventConsumer({
  eventExchange,
  eventQueue
})
