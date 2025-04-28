const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectRedis, getRedisClient } = require('./cache/redis');
const { connectMongo, saveTasksToMongo, getTasksFromMongo } = require('./db/mongodb');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  } 
});

const TASK_KEY = 'FULLSTACK_TASK_SHIVAM';
const MAX_CACHE_SIZE = 50;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

const initialize = async () => {
  try {
    await connectRedis();
    await connectMongo();
    console.log('Connected to Redis and MongoDB');
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
};

io.on('connection', (socket) => {
  socket.on('add', async (task) => {
    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return socket.emit('error', 'Invalid task');
    }

    try {
      const redisClient = getRedisClient();
      let tasks = await redisClient.get(TASK_KEY);
      tasks = tasks ? JSON.parse(tasks) : [];

      const newTask = { id: Date.now().toString(), text: task.trim(), completed: false };
      tasks.push(newTask);

      if (tasks.length > MAX_CACHE_SIZE) {
        await saveTasksToMongo(tasks);
        await redisClient.del(TASK_KEY);
        tasks = [];
      } else {
        await redisClient.set(TASK_KEY, JSON.stringify(tasks));
      }

      io.emit('update', tasks);
    } catch (error) {
      console.error('Error adding task:', error);
      socket.emit('error', 'Failed to add task');
    }
  });
});

app.get('/fetchAllTasks', async (req, res) => {
  try {
    const redisClient = getRedisClient();
    let tasks = await redisClient.get(TASK_KEY);
    tasks = tasks ? JSON.parse(tasks) : [];

    if (tasks.length === 0) {
      tasks = await getTasksFromMongo();
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

initialize().then(() => {
  server.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  });
}).catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});