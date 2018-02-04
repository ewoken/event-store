import mongodb from 'mongodb';

async function buildMongoClient(url) {
  const { MongoClient } = mongodb;
  const mongoClient = await MongoClient.connect(url);
  return mongoClient;
}

export default buildMongoClient;
