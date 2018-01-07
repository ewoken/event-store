import config from 'config'
import mongodb from 'mongodb'

async function buildEventDatabase () {
  const MongoClient = mongodb.MongoClient
  const eventDatabase = await MongoClient.connect(config.get('eventDatabase.url'))
  return eventDatabase
}

export default buildEventDatabase
