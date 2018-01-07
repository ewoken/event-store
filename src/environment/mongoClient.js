import config from 'config'
import mongodb from 'mongodb'

async function buildMongoClient () {
  const MongoClient = mongodb.MongoClient
  const mongoClient = await MongoClient.connect(config.get('mongodb.url'))
  return mongoClient
}

export default buildMongoClient
