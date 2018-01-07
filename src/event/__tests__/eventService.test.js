/* global beforeAll afterAll describe, test, expect */

import buildEnvironment from '../../environment'
import buildEventRepository from '../eventRepository'
import buildEventDispatcher from '../eventDispatcher'
import buildEventService from '../eventService'
import buildEventListener from '../../utils/eventListener'

beforeAll(async () => {
  const environment = await buildEnvironment()
  const eventRepository = buildEventRepository(environment)
  const eventDispatcher = buildEventDispatcher(environment)

  global.eventService = buildEventService({
    eventRepository,
    eventDispatcher
  })
  global.environment = environment
  global.eventListener = await buildEventListener()

  return global.eventService.deleteAllEvents()
})

afterAll(() => {
  global.environment.close()
  global.eventListener.destroy()
  return global.eventService.deleteAllEvents()
})

describe('event service', () => {
  describe('insertEvent(event)', () => {
    test('should insert and dispatch an event', async () => {
      const testEvent = {
        type: 'EVENT_TEST',
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }

      const eventReceived = new Promise(resolve => {
        global.eventListener.once('event', event => {
          expect(event).toMatchObject(testEvent)
          resolve()
        })
      })
      const insertedEvent = await global.eventService.insertEvent(testEvent)
      expect(insertedEvent).toMatchObject(testEvent)
      await eventReceived
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
