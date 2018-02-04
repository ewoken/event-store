/* global describe, test, expect */

import { assertInput } from '@ewoken/backend-common/lib/assertSchema'
import { EventInput, EventCriteriaInput } from '../types'

describe('eventSchema', () => {
  const baseEvent = {
    type: 'TEST_EVENT',
    userId: null,
    entityType: 'TEST_ENTITY',
    entityId: '00000000000000',
    createdAt: new Date()
  }

  test('should validate an event object', () => {
    const validatedEvent = assertInput(EventInput, baseEvent)
    expect(validatedEvent).toEqual(baseEvent)
  })

  test('should validate when createdAt is a iso string', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: baseEvent.createdAt.toISOString()
    })
    const validatedEvent = assertInput(EventInput, event)
    expect(validatedEvent).toEqual(baseEvent)
  })

  test('should set a default value for createdAt', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: undefined
    })
    const validatedEvent = assertInput(EventInput, event)
    expect(validatedEvent).not.toBe(undefined)
  })

  test('should reject bad event', async () => {
    const event = Object.assign({}, baseEvent, { userId: undefined })
    expect(() => assertInput(EventInput, event)).toThrow(/userId/)
  })
})

describe('criteria schema', () => {
  test('should validate all kinds of criteria', () => {
    const criterias = [
      { userId: 'userId' },
      { entityType: 'entityType' },
      { entityId: 'entityId', entityType: 'entityType' },
      { type: 'type1', entityType: 'entityType' }
    ]
    criterias.forEach(criteria => {
      assertInput(EventCriteriaInput, criteria)
    })
  })

  test('should not validate bad criterias', () => {
    const criterias = [
      {},
      { entityId: 'entityId' },
      { type: 'type1' }
    ]
    criterias.forEach(criteria => {
      expect(() => assertInput(EventCriteriaInput, criteria)).toThrow()
    })
  })
})
