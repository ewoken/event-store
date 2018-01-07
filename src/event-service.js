import assert from 'assert'
import joi from 'joi'

import eventSchema from './event-schema'
import formatMongoObject from './utils/formatMongoObject'

function buildEventService (environment) {
  const db = environment.eventDatabase
  const eventDispatcher = environment.eventDispatcher
  assert(db)
  const eventCollection = db.collection('events')

  async function insertEvent (event) {
    const newEvent = await joi.validate(event, eventSchema)
    const res = await eventCollection.insert(newEvent)
    const insertedEvent = formatMongoObject(res.ops[0])
    await eventDispatcher.dispatch(event)
    return insertedEvent
  }

  function deleteAllEvents () {
    return eventCollection.remove({})
  }

  return {
    insertEvent,
    deleteAllEvents
  }
}

export default buildEventService
