import { EventEmitter } from 'events';
import { assertInput } from '@ewoken/backend-common/lib/assertSchema';

import { EventInput, EventCriteriaInput } from './types';
import eventRepository from './eventRepository';

const bus = new EventEmitter();

async function insertEvent(event) {
  const newEvent = assertInput(EventInput, event);
  const insertedEvent = await eventRepository.insert(newEvent);
  return insertedEvent;
}

async function getEventListByCriteria(criteria) {
  const newCriteria = assertInput(EventCriteriaInput, criteria);
  return eventRepository.getEventListByCriteria(newCriteria);
}

function deleteAllEvents() {
  return eventRepository.deleteAll();
}

export default {
  bus,

  insertEvent,
  getEventListByCriteria,
  deleteAllEvents,
};
