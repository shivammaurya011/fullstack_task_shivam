const { MongoClient } = require('mongodb');

let mongoClient;

const connectMongo = async () => {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    console.log('Connected-PCR to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

const saveTasksToMongo = async (tasks) => {
  try {
    const db = mongoClient.db('assignment');
    const collection = db.collection('assignment_shivam');
    await collection.updateOne(
      { type: 'tasks' },
      { $set: { tasks, updatedAt: new Date() } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving tasks to MongoDB:', error);
    throw error;
  }
};

const getTasksFromMongo = async () => {
  try {
    const db = mongoClient.db('assignment');
    const collection = db.collection('assignment_shivam');
    const doc = await collection.findOne({ type: 'tasks' });
    return doc ? doc.tasks : [];
  } catch (error) {
    console.error('Error fetching tasks from MongoDB:', error);
    return [];
  }
};

const closeMongo = async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectMongo, saveTasksToMongo, getTasksFromMongo, closeMongo };