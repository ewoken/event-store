import Joi from 'joi'

const eventType = Joi.string().min(5).max(100)
const entityType = Joi.string().min(5).max(100)
const entityId = Joi.string().min(5).max(500)
const userId = Joi.string().min(5).max(500)

export const eventSchema = Joi.object({
  type: eventType.required(),
  entityType: entityType.required(),
  entityId: entityId.required(),
  userId: userId.allow(null).required(),
  createdAt: Joi.date().iso().default(() => new Date(), 'set to now'),
  payload: Joi.object()
})

export const criteriaSchema = Joi.object({
  type: eventType,
  entityType: entityType
    .when('type', { is: Joi.exist(), then: Joi.required() })
    .when('entityId', { is: Joi.exist(), then: Joi.required() }),
  entityId: entityId,
  userId: userId.allow(null)
}).min(1)
