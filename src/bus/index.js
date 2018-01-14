import config from 'config'
import EventConsumer from '../utils/EventConsumer'

async function buildBusInterface ({ amqpClient, logger }, { eventService }) {
  const eventExchange = config.get('bus.eventExchange')
  const eventQueue = config.get('bus.eventQueue')
  const eventConsumer = new EventConsumer({
    eventExchange,
    eventQueue,
    amqpClient,
    logger
  })

  await eventConsumer.init()

  eventConsumer.onEvent(eventService.insertEvent)
}

export default buildBusInterface
