import config from 'config'
import EventConsumer from '../utils/EventConsumer'

async function buildBusInterface ({ amqpClient }, { eventService }) {
  const eventExchange = config.get('eventService.eventExchange')
  const eventQueue = config.get('eventService.eventQueue')
  const eventConsumer = new EventConsumer({ eventExchange, eventQueue, amqpClient })

  await eventConsumer.init()

  eventConsumer.onEvent(eventService.insertEvent)
}

export default buildBusInterface
