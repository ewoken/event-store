import { assertInput } from '@ewoken/backend-common/lib/assertSchema';
import Service from '@ewoken/backend-common/lib/Service';

import { EventInput, EventCriteriaInput } from './types';
import EventRepository from './EventRepository';

class EventService extends Service {
  constructor(environment) {
    super('eventService', environment);
    this.eventRepository = new EventRepository(environment);
  }

  async init() {
    this.eventRepository.init();
  }

  async insertEvent(event) {
    const newEvent = assertInput(EventInput, event);
    const insertedEvent = await this.eventRepository.insert(newEvent);
    return insertedEvent;
  }

  async getEventListByCriteria(criteria) {
    const newCriteria = assertInput(EventCriteriaInput, criteria);
    return this.eventRepository.getEventListByCriteria(newCriteria);
  }

  deleteAllEvents() {
    return this.eventRepository.deleteAll();
  }
}

export default EventService;
