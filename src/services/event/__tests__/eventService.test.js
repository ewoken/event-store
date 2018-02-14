/* global beforeAll afterAll describe test expect beforeEach */

import initEventService from '../index';
import buildEnvironment from '../../../environment';

let environment;
let eventService;
beforeAll(async () => {
  environment = await buildEnvironment();
  eventService = await initEventService(environment);
});

beforeEach(() => eventService.deleteAllEvents());

afterAll(async () => {
  await eventService.deleteAllEvents();
  environment.close();
});

describe('event service', () => {
  describe('insertEvent(event)', () => {
    test('should insert an event', async () => {
      const testEvent = {
        type: 'EVENT_TEST',
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        authorUserId: 'userId',
      };

      const insertedEvent = await eventService.insertEvent(testEvent);
      expect(insertedEvent).toMatchObject(testEvent);
    });

    test('should fail for a bad event', async () => {
      const badEvent = {
        // no type
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        authorUserId: 'userId',
      };
      await expect(eventService.insertEvent(badEvent)).rejects.toThrow(/type/);
    });
  });
});
