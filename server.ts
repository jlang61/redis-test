import WebSocket from 'ws';
import { createClient } from 'redis';

const wss = new WebSocket.Server({ port: 8080 });
const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();

  const subscriber = redisClient.duplicate();
  await subscriber.connect();

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', async (message: string) => {
      console.log(`Received message: ${message}`);
      await redisClient.publish('channel', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  subscriber.subscribe('channel', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Server received your message: ${message}`);
      }
    });
  });
})();