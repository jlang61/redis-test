// listener-server.js

import express from 'express';
import { createServer } from 'http';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import WebSocket from 'ws'; // Import the WebSocket library

interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> {}

const app = express();
const port = 3001;

app.use(express.json());

const server = createServer(app);

// Connect to Redis
const connectToRedis = async (): Promise<MyRedisClient> => {
  try {
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

// Start listening to Redis and WebSocket messages
const startListener = async () => {
  try {
    const subscriber = await connectToRedis();

    // Subscribe to Redis channels
    subscriber.subscribe('article', (message) => {
      const article = JSON.parse(message);
      console.log('Received article from Redis:', article);
    });

    subscriber.subscribe('ws-messages', (message) => {
      console.log('Received message from Redis channel ws-messages:', message);
    });

    console.log('Listening for Redis messages on the respective channels...');

    // Connect to WebSocket server on port 3002
    const wsClient = new WebSocket('ws://localhost:3002');

    // Handle WebSocket connection open
    wsClient.on('open', () => {
      console.log('Connected to WebSocket server on port 3002');
    });

    // Handle incoming WebSocket messages
    wsClient.on('message', (data) => {
      console.log('Received message from WebSocket server:', data.toString());
    });

    // Handle WebSocket connection close
    wsClient.on('close', () => {
      console.log('WebSocket connection closed');
    });

    // Handle WebSocket errors
    wsClient.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

  } catch (error) {
    console.error('Failed to start listener:', error);
  }
};

startListener();

server.listen(port, () => {
  console.log(`Listener server is running on http://localhost:${port}`);
});
