import assert from 'assert'

function validEvent (event) {
  assert.equal(typeof event.type, 'string', 'Expect event to have a type')
  assert.equal(typeof event.payload, 'object',
    'Expect event to have a payload object')

  if (event.aggregateId || event.aggregateType) {
    assert.equal(typeof event.aggregateId, 'string')
    assert.equal(typeof event.aggregateType, 'string')
    return {
      type: event.type,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      payload: event.payload,
      createdAt: new Date()
    }
  } else {
    return {
      type: event.type,
      payload: event.payload,
      createdAt: new Date()
    }
  }
}

function transformId (data) {
  data._id = data._id.toString()
  return data
}

class EventStore {
  constructor (options = {}) {
    this.db = null
    this.eventCollection = null
  }

  checkInit () {
    if (!this.db) {
      throw new Error('Should be init')
    }
  }

  async init (db) {
    assert(db)
    this.db = db
    this.eventCollection = this.db.collection('events')
  }

  async insertEvent (event) {
    this.checkInit()
    const res = await this.eventCollection.insert(validEvent(event))
    const insertedEvent = transformId(res.ops[0])
    return insertedEvent
  }

  async insertManyEvents (events) {
    this.checkInit()
    const res = await this.eventCollection.insert(events.map(validEvent))
    const insertedEvents = events.map((event, i) => ({
      _id: res.insertedIds[i].toString(),
      ...event
    }))
    return insertedEvents
  }

  async close () {
    this.checkInit()
    this.db.close()
  }
}

export default EventStore
