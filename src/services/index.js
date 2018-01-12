import initEventService from './event'

async function initServices (environment) {
  const services = {}

  services.eventService = await initEventService(environment)

  return services
}

export default initServices
