function buildEventDispatcher (environment) {
  const redisClient = environment.redisClient

  function dispatch (event) {
    const { entityType, entityId, type } = event
    const userId = event.userId === null
      ? '_'
      : event.userId
    const channel = `events.${userId}.${entityType}.${type}.${entityId}`
    return redisClient
      .publishAsync(channel, JSON.stringify(event))
  }

  return {
    dispatch
  }
}

export default buildEventDispatcher
