import formatMongoObject from '../utils/formatMongoObject'

function buildEventRepository (environment) {
  const db = environment.mongoClient
  const eventCollection = db.collection('events')

  async function insertEvent (event) {
    const res = await eventCollection.insert(event)
    const insertedEvent = formatMongoObject(res.ops[0])
    return insertedEvent
  }

  function deleteAll () {
    return eventCollection.remove({})
  }

  return {
    insertEvent,
    deleteAll
  }
}

export default buildEventRepository
