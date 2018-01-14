class EventDispatcher {
  constructor ({ amqpClient, eventExchange }) {
    this.eventExchange = eventExchange
    this.amqpClient = amqpClient
  }

  dispatch (event) {
    const { userId, entityType, type, entityId } = event
    const key = `${userId}.${entityType}.${type}.${entityId}`
    this.amqpClient.publish(this.eventExchange, key, Buffer.from(JSON.stringify(event)))
  }
}

export default EventDispatcher
