/* global describe, test, expect */

import eventSchema from '../eventSchema'
import Joi from 'joi'

describe('eventSchema', () => {
  const baseEvent = {
    type: 'TEST_EVENT',
    userId: null,
    entityType: 'TEST_ENTITY',
    entityId: '00000000000000',
    createdAt: new Date()
  }

  test('should validate an event object', () => {
    const res = Joi.validate(baseEvent, eventSchema)
    expect(res.error).toBe(null)
    expect(res.value).toEqual(baseEvent)
  })

  test('should validate when createdAt is a iso string', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: baseEvent.createdAt.toISOString()
    })
    const res = Joi.validate(event, eventSchema)
    expect(res.error).toBe(null)
    expect(res.value).toEqual(baseEvent)
  })

  test('should set a default value for createdAt', () => {
    const event = Object.assign({}, baseEvent, {
      createdAt: undefined
    })
    const res = Joi.validate(event, eventSchema)
    expect(res.error).toBe(null)
    expect(res.value.createdAt).not.toBe(undefined)
  })

  test('should reject bad event', () => {
    const event = Object.assign({}, baseEvent, { userId: undefined })
    expect(Joi.validate(event, eventSchema).error).not.toBe(null)
  })
})
