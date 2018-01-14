import eventService from './eventService'
import eventRepository from './eventRepository'

async function initEventService ({ mongoClient }) {
  eventRepository.init(mongoClient)

  return eventService
}

export default initEventService
