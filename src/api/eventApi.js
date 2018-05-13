import express from 'express';
import serviceToRoute from '@ewoken/backend-common/lib/api/serviceToRoute';

function buildEventApi(eventService) {
  const router = new express.Router();

  router.post('/', serviceToRoute(eventService.insertEvent));

  // TODO add all delete for test

  return router;
}

export default buildEventApi;
