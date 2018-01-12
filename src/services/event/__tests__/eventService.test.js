/* global beforeAll afterAll describe test expect beforeEach */

import initEventService from '../index'
import buildEnvironment from '../../../environment'

beforeAll(async () => {
  const environment = await buildEnvironment()

  global.eventService = await initEventService(environment)
  global.environment = environment
})

afterAll(() => {
  global.environment.close()
})

beforeEach(() => {
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

      return global.eventService.deleteAllEvents()
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

      return global.eventService.deleteAllEvents()
    })
  })

  test('should dispatch and consume event', async () => {
    const testEvent = {
      type: 'EVENT_TEST',
      entityType: 'TEST_ENTITY',
      entityId: 'entity_id',
      userId: 'userId'
    }
    await global.eventService.dispatchEvent(testEvent)
    await new Promise(resolve => setTimeout(resolve, 100))
    const events = await global.eventService.getEventListByCriteria({ userId: 'userId' })
    expect(events.length).toEqual(1)
    expect(events[0].type).toEqual('EVENT_TEST')

    return global.eventService.deleteAllEvents()
  })
})
