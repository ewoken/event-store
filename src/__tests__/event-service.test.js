/* global beforeAll afterAll describe, test, expect */

import buildEnvironment from '../environment'
import buildEventService from '../event-service'

beforeAll(async () => {
  global.environment = await buildEnvironment()
  global.eventService = await buildEventService(global.environment)
  return global.eventService.deleteAllEvents()
})

afterAll(() => {
  global.environment.close()
  return global.eventService.deleteAllEvents()
})

describe('event service', () => {
  describe('insertEvent(event)', () => {
    test('should insert an event', async () => {
      const testEvent = {
        type: 'EVENT_TEST',
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }
      const insertedEvent = await global.eventService.insertEvent(testEvent)
      expect(insertedEvent).toMatchObject(testEvent)
    })

    test('should fail for a bad event', async () => {
      const badEvent = {
        // no type
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }
      await expect(global.eventService.insertEvent(badEvent))
        .rejects
        .toThrow(/type/)
    })
  })
})
