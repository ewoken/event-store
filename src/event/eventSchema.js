import Joi from 'joi'

const eventSchema = Joi.object({
  type: Joi.string().min(5).max(100).required(),
  entityType: Joi.string().min(5).max(100).required(),
  entityId: Joi.string().min(5).max(500).required(),
  userId: Joi.string().min(5).max(500).allow(null).required(),
  createdAt: Joi.date().iso().default(() => new Date(), 'set to now'),
  payload: Joi.object()
})

export default eventSchema
