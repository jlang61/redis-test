import WebSocket from 'ws';

const serverUrl = 'ws://localhost:3000'; 

const ws = new WebSocket(serverUrl);

ws.on('open', () => {
  console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
  const article = JSON.parse(data.toString());
  console.log('Received article:', article);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
