import express from 'express';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';

// Define your specific RedisClientType if using modules
interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> {}

const app = express();
const port = 3001; // Different port for the listener server

app.use(express.json());

const connectToRedis = async (): Promise<MyRedisClient> => {
  try {
    // Update with your Redis server address and port
    const client = createClient({
      url: 'redis://127.0.0.1:6379'
    }) as MyRedisClient;
    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};

const startListener = async () => {
  try {
    const subscriber = await connectToRedis();

    subscriber.subscribe('article', (message) => {
      const article = JSON.parse(message);
      console.log('Received article:', article);
    });

    console.log('Listening for articles on the "article" channel...');
  } catch (error) {
    console.error('Failed to start listener:', error);
  }
};

startListener();

app.listen(port, () => {
  console.log(`Listener server is running on http://localhost:${port}`);
});
