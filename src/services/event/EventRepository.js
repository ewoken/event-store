import formatMongoObject from '@ewoken/backend-common/lib/formatMongoObject';

class EventRepository {
  constructor({ mongoClient }) {
    this.db = mongoClient;
    this.eventCollection = this.db.collection('events');
  }

  init() {
    return this;
  }

  async insert(event) {
    const res = await this.eventCollection.insert(event);
    const insertedEvent = formatMongoObject(res.ops[0]);
    return insertedEvent;
  }

  async getEventListByCriteria(inputCriteria) {
    const { userId, ...others } = inputCriteria;
    const criteria = {
      ...others,
      $or: [{ authorUserId: userId }, { targetUserId: userId }],
    };
    const eventList = await this.eventCollection
      .find(criteria)
      .limit(100)
      .toArray();
    return eventList.map(formatMongoObject);
  }

  deleteAll() {
    return this.eventCollection.remove({});
  }
}

export default EventRepository;
