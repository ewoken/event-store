import buildEventDatabase from './eventDatabase'
import buildEventDispatcher from './eventDispatcher'

async function buildEnvironment () {
  const eventDatabase = await buildEventDatabase()
  const eventDispatcher = await buildEventDispatcher()

  return {
    eventDatabase,
    eventDispatcher,
    close () {
      eventDatabase.close()
      eventDispatcher.close()
    }
  }
}

module.exports = buildEnvironment
