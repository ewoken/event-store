import eventService from './eventService'
import eventRepository from './eventRepository'
import withLogger from '../../utils/withLoggerService'

async function initEventService ({ mongoClient, logger }) {
  logger.info('Init event service')
  eventRepository.init(mongoClient)

  return withLogger(logger)({
    serviceName: 'eventService',
    service: eventService
  })
}

export default initEventService
