import WebSocket from 'ws';
import axios from 'axios';

const serverUrl = 'ws://localhost:3000';
const apiUrl = 'http://localhost:3000/clients';
const numberOfClients = 5; 

const clients: WebSocket[] = [];

for (let i = 0; i < numberOfClients; i++) {
  const ws = new WebSocket(serverUrl);
  clients.push(ws);

  ws.on('open', () => {
    console.log(`Client ${i + 1} connected`);
  });

  ws.on('close', () => {
    console.log(`Client ${i + 1} disconnected`);
  });

  ws.on('error', (error) => {
    console.error(`Client ${i + 1} error:`, error);
  });
}

setTimeout(async () => {
  try {
    const response = await axios.get(apiUrl);
    console.log('Connected WebSocket clients:', response.data);
  } catch (error) {
    console.error('Error fetching clients:', error);
  }

  clients.forEach((ws) => ws.close());
}, 5000);
