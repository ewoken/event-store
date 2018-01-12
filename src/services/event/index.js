import eventService from './eventService'
import eventRepository from './eventRepository'
import eventDispatcher from './eventDispatcher'
import eventConsumer from './eventConsumer'

async function initEventService ({ mongoClient, amqpClient }) {
  eventRepository.init(mongoClient)
  eventDispatcher.init(amqpClient)
  await eventConsumer.init(amqpClient)
  eventService.consumeEvents()

  return eventService
}

export default initEventService
