import withLogger from '@ewoken/backend-common/lib/withLoggerService';

import eventService from './eventService';
import eventRepository from './eventRepository';

async function initEventService({ mongoClient, logger }) {
  logger.info('Init event service');
  eventRepository.init(mongoClient);

  return withLogger(logger)({
    serviceName: 'eventService',
    service: eventService,
  });
}

export default initEventService;
