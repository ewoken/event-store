import config from 'config'

class EventDispatcher {
  constructor (eventExchange) {
    this.eventExchange = eventExchange
    this.amqpClient = null
  }

  init (amqpClient) {
    this.amqpClient = amqpClient
    return this
  }

  dispatch (event) {
    const { userId, entityType, type, entityId } = event
    const key = `${userId}.${entityType}.${type}.${entityId}`
    this.amqpClient.publish(this.eventExchange, key, Buffer.from(JSON.stringify(event)))
  }
}

const eventExchange = config.get('eventService.eventExchange')
export default new EventDispatcher(eventExchange)
