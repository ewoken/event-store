import Joi from 'joi';

const eventType = Joi.string()
  .min(5)
  .max(100);
const entityType = Joi.string()
  .min(3)
  .max(100);
const entityId = Joi.string()
  .min(5)
  .max(500);
const userId = Joi.string()
  .min(5)
  .max(500);

/**
 * Most of event will have an author user, then, in order to prevent developer
 * from forgetting authorUserId, it is required and should explicitly set to null
 *
 * Most of event will not have a target user, then, targetUserId is not required
 *
 * Not required keys are set to default null, in order to keep a consistent object
 * in the service
 */
export const EventInput = Joi.object({
  type: eventType.required(),
  entityType: entityType.required(),
  entityId: entityId.required(),
  authorUserId: userId.allow(null).required(),
  targetUserId: userId.allow(null).default(null),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date(), 'set to now'),
  payload: Joi.object()
    .allow(null)
    .default(null),
});

export const EventCriteriaInput = Joi.object({
  type: eventType,
  entityType,
  entityId,
  userId: userId.allow(null),
})
  .min(1)
  .with('type', 'entityType')
  .with('entityId', 'entityType');
