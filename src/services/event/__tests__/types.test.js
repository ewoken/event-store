/* global describe, test, expect */

import { eventSchema, criteriaSchema } from '../types'

describe('eventSchema', () => {
  const baseEvent = {
    type: 'TEST_EVENT',
    userId: null,
    entityType: 'TEST_ENTITY',
    entityId: '00000000000000',
    createdAt: new Date()
  }

  test('should validate an event object', () => {
    const res = eventSchema.validate(baseEvent)
    expect(res.error).toBe(null)
    expect(res.value).toEqual(baseEvent)
  })

  test('should validate when createdAt is a iso string', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: baseEvent.createdAt.toISOString()
    })
    const res = eventSchema.validate(event)
    expect(res.error).toBe(null)
    expect(res.value).toEqual(baseEvent)
  })

  test('should set a default value for createdAt', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: undefined
    })
    const res = eventSchema.validate(event)
    expect(res.error).toBe(null)
    expect(res.value.createdAt).not.toBe(undefined)
  })

  test('should reject bad event', () => {
    const event = Object.assign({}, baseEvent, { userId: undefined })
    expect(eventSchema.validate(event).error).not.toBe(null)
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
      const res = criteriaSchema.validate(criteria)
      expect(res.error).toBe(null)
    })
  })

  test('should validate all kinds of criteria', () => {
    const criterias = [
      {},
      { entityId: 'entityId' },
      { type: 'type1' }
    ]
    criterias.forEach(criteria => {
      const res = criteriaSchema.validate(criteria)
      expect(res.error).not.toBe(null)
    })
  })
})
