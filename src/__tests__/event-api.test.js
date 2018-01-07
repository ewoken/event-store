/* global beforeAll, afterAll, describe, test, expect */

import launchApp from '../app'
import fetchApi from '../utils/fetchApi'
import getBaseUrl from '../utils/getBaseUrl'

beforeAll(async () => {
  const server = await launchApp()
  global.server = server
})

afterAll(() => {
  return new Promise(resolve => {
    const server = global.server
    server.unref()
    server.destroy(resolve)
  })
})

describe('event api', () => {
  const baseUrl = () => getBaseUrl(global.server)

  describe('POST /events', () => {
    const postEvent = event => fetchApi(`${baseUrl()}/events`, {
      method: 'POST',
      body: JSON.stringify(event)
    })

    test('should accept event', async () => {
      const testEvent = {
        type: 'EVENT_TEST',
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }
      const returnedEvent = await postEvent(testEvent)
      expect(returnedEvent).toMatchObject(testEvent)
    })

    test('should reject bad event', async () => {
      const badEvent = {
        // no type
        entityType: 'TEST_ENTITY',
        entityId: 'entity_id',
        userId: 'userId'
      }

      await expect(postEvent(badEvent)).rejects.toThrow(/400/)
    })
  })
})
