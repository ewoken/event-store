/* global beforeAll afterAll describe test expect afterEach */

import initEventService from '../index'
import buildEnvironment from '../../../environment'

let environment, eventService
beforeAll(async () => {
  environment = await buildEnvironment()
  eventService = await initEventService(environment)
  return eventService.deleteAllEvents()
})

afterAll(() => {
  environment.close()
})

afterEach(() => {
  return eventService.deleteAllEvents()
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

      const insertedEvent = await eventService.insertEvent(testEvent)
      expect(insertedEvent).toMatchObject(testEvent)
    })

    test('should fail for a bad event', async () => {
      const badEvent = {
        // no type
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }
      await expect(eventService.insertEvent(badEvent))
        .rejects
        .toThrow(/type/)
    })
  })
})
