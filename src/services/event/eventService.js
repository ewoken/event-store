import { eventSchema, criteriaSchema } from './types'
import eventRepository from './eventRepository'

async function insertEvent (event) {
  const newEvent = await eventSchema.validate(event)
  const insertedEvent = await eventRepository.insert(newEvent)
  return insertedEvent
}

async function getEventListByCriteria (criteria) {
  const newCriteria = await criteriaSchema.validate(criteria)
  return eventRepository.getEventListByCriteria(newCriteria)
}

function deleteAllEvents () {
  return eventRepository.deleteAll()
}

export default {
  insertEvent,
  getEventListByCriteria,
  deleteAllEvents
}
