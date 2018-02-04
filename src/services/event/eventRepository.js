import formatMongoObject from '@ewoken/backend-common/lib/formatMongoObject'

class EventRepository {
  constructor () {
    this.db = null
    this.eventCollection = null
  }

  init (db) {
    this.db = db
    this.eventCollection = this.db.collection('events')
    return this
  }

  async insert (event) {
    const res = await this.eventCollection.insert(event)
    const insertedEvent = formatMongoObject(res.ops[0])
    return insertedEvent
  }

  async getEventListByCriteria (criteria) {
    const eventList = await this.eventCollection.find(criteria)
      .limit(100)
      .toArray()
    return eventList.map(formatMongoObject)
  }

  deleteAll () {
    return this.eventCollection.remove({})
  }
}

export default new EventRepository()
