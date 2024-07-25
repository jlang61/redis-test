import { fork } from 'child_process';
import path from 'path';

const numberOfClients = 5; 

for (let i = 0; i < numberOfClients; i++) {
  const clientPath = path.resolve(__dirname, 'testclient.ts');
  const clientProcess = fork(clientPath);

  clientProcess.on('message', (message) => {
    console.log(`Client ${i + 1}: ${message}`);
  });

  clientProcess.on('error', (error) => {
    console.error(`Client ${i + 1} error:`, error);
  });

  clientProcess.on('exit', (code) => {
    console.log(`Client ${i + 1} exited with code ${code}`);
  });
}
