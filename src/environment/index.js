import buildMongoClient from './mongoClient'
import buildRedisClient from './redisClient'

async function buildEnvironment () {
  const mongoClient = await buildMongoClient()
  const redisClient = await buildRedisClient()

  return {
    mongoClient,
    redisClient,
    close () {
      mongoClient.close()
      redisClient.end(false)
    }
  }
}

module.exports = buildEnvironment
