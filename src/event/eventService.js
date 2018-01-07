import joi from 'joi'

import eventSchema from './eventSchema'

function buildEventService ({ eventRepository, eventDispatcher }) {
  async function insertEvent (event) {
    const newEvent = await joi.validate(event, eventSchema)
    const insertedEvent = await eventRepository.insert(newEvent)
    await eventDispatcher.dispatch(event)
    return insertedEvent
  }

  function deleteAllEvents () {
    return eventRepository.deleteAll()
  }

  return {
    insertEvent,
    deleteAllEvents
  }
}

export default buildEventService
