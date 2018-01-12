import { eventSchema, criteriaSchema } from './types'
import eventRepository from './eventRepository'
import eventDispatcher from './eventDispatcher'
import eventConsumer from './eventConsumer'

async function insertEvent (event) {
  const newEvent = await eventSchema.validate(event)
  const insertedEvent = await eventRepository.insert(newEvent)
  return insertedEvent
}

async function getEventListByCriteria (criteria) {
  const newCriteria = await criteriaSchema.validate(criteria)
  return eventRepository.getEventListByCriteria(newCriteria)
}

function consumeEvents () {
  eventConsumer.onEvent(insertEvent)
}

function deleteAllEvents () {
  return eventRepository.deleteAll()
}

async function dispatchEvent (event) {
  const newEvent = await eventSchema.validate(event)
  eventDispatcher.dispatch(newEvent)
  return newEvent
}

export default {
  insertEvent,
  getEventListByCriteria,
  consumeEvents,
  dispatchEvent,
  deleteAllEvents
}
