import express from 'express'
import serviceToRoute from '../utils/serviceToRoute'

import buildRepository from './eventRepository'
import buildEventDispatcher from './eventDispatcher'
import buildEventService from './eventService'

function buildEventApi (environment) {
  const eventRepository = buildRepository(environment)
  const eventDispatcher = buildEventDispatcher(environment)
  const eventService = buildEventService({
    eventRepository,
    eventDispatcher
  })

  const router = new express.Router()

  router.post('/', serviceToRoute(eventService.insertEvent))

  return router
}

export default buildEventApi
