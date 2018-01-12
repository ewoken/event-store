import buildEventApi from './eventApi'

function buildApi (app, { eventService }) {
  app.use('/events', buildEventApi(eventService))
}

export default buildApi
