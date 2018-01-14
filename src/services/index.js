import initEventService from './event'

async function initServices (environment) {
  environment.logger.info('Init services...')
  const services = {}

  services.eventService = await initEventService(environment)

  return services
}

export default initServices
