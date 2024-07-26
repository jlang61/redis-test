import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';

interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> {}

const app = express();
const port = 3001; 

app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

let wsClients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
  wsClients.add(ws);

  ws.on('message', async (message) => {
    console.log('Received message from WebSocket client:', message.toString());
    
    const publisher = await connectToRedis();
    await publisher.publish('ws-messages', message.toString());
    await publisher.quit();
  });

  ws.on('close', () => {
    wsClients.delete(ws);
  });
});

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

const startListener = async () => {
  try {
    const subscriber = await connectToRedis();

    subscriber.subscribe('article', (message) => {
      const article = JSON.parse(message);
      console.log('Received article:', article);

      wsClients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(article));
        }
      });
    });

    subscriber.subscribe('ws-messages', (message) => {
      console.log('Received message from Redis channel ws-messages:', message);

      wsClients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    });

    console.log('Listening for articles and WebSocket messages on the respective channels...');
  } catch (error) {
    console.error('Failed to start listener:', error);
  }
};

startListener();

server.listen(port, () => {
  console.log(`Listener server is running on http://localhost:${port}`);
});
