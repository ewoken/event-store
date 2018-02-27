import { values } from 'ramda';

import EventService from './event';

async function initServices(environment) {
  environment.logger.info('Init services...');
  const services = {
    eventService: new EventService(environment),
  };

  const serviceList = values(services);
  await Promise.all(serviceList.map(service => service.init(services)));

  return services;
}

export default initServices;
