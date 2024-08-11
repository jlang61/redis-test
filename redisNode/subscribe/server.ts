
import { WebSocketServer } from 'ws';

const port = 3002;

const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket server');

  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  ws.on('message', (message) => {
    console.log('Received message from client:', message.toString());

    ws.send(JSON.stringify({ message: `Echo: ${message}` }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
