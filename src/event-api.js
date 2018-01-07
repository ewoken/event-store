import express from 'express'
import serviceToRoute from './utils/serviceToRoute'

function buildEventApi ({ eventService }) {
  const router = new express.Router()

  router.post('/', serviceToRoute(eventService.insertEvent))

  return router
}

export default buildEventApi
