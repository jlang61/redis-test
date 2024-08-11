// websocket-server.js

import { WebSocketServer } from 'ws';

const port = 3002;

// Create a WebSocket server
const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket server');

  // Send a welcome message to the client
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log('Received message from client:', message.toString());

    // Echo the message back to the client
    ws.send(JSON.stringify({ message: `Echo: ${message}` }));
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
