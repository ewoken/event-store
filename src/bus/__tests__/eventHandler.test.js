/* global beforeAll afterAll describe test expect beforeEach */
import config from 'config'
import EventDispatcher from '@ewoken/backend-common/lib/bus/EventDispatcher'

import buildEnvironment from '../../environment'
import initServices from '../../services'
import buildBusInterface from '../index'

// TODO server
let environment, services, eventService, eventDispatcher
beforeAll(async () => {
  const eventExchange = config.get('bus.eventExchange')

  environment = await buildEnvironment()
  services = await initServices(environment)
  eventService = services.eventService
  await buildBusInterface(environment, services)
  eventDispatcher = new EventDispatcher({
    amqpClient: environment.amqpClient,
    logger: environment.logger,
    eventExchange
  })
})

beforeEach(() => {
  return eventService.deleteAllEvents()
})

afterAll(() => {
  environment.close()
  return eventService.deleteAllEvents()
})

describe('event handler', () => {
  test('should insert an event', async () => {
    const testEvent = {
      type: 'EVENT_TEST',
      entityType: 'TEST_ENTITY',
      entityId: 'entity_id',
      userId: 'userId'
    }

    eventDispatcher.dispatch(testEvent)
    await new Promise(resolve => setTimeout(resolve, 100))
    const events = await eventService.getEventListByCriteria({ userId: 'userId' })
    expect(events.length).toEqual(1)
    expect(events[0].type).toEqual('EVENT_TEST')
  })
})
