import WebSocket from 'ws';

const numberOfClients: number = 100;
const clients: WebSocket[] = [];

for (let i = 0; i < numberOfClients; i++) {
  const client: WebSocket = new WebSocket('ws://localhost:8080');

  client.on('open', () => {
    console.log(`Client ${i} connect  ed`);
    client.send(`Hello from client ${i}`);
  });

  client.on('message', (message: string) => {
    console.log(`Client ${i} received message: ${message}`);
  });

  client.on('close', () => {
    console.log(`Client ${i} disconnected`);
  });

  clients.push(client);
}

// Close all clients after 10 seconds
setTimeout(() => {
  clients.forEach((client, index) => {
    client.close();
    console.log(`Client ${index} closed`);
  });
}, 30000);