import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';

interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> { }

const app = express();
const port = 3000;

app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const wsClients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
    wsClients.add(ws);
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

app.post('/publish', async (req: Request, res: Response) => {
    const article = {
        id: req.body.id || '123456',
        name: req.body.name || 'Testing publish',
    };

    try {
        const publisher = await connectToRedis();
        await publisher.publish('article', JSON.stringify(article));
        await publisher.quit();

        wsClients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(article));
            }
        });

        res.status(200).send('Article published');
    } catch (error) {
        console.error('Error publishing article:', error);
        res.status(500).send('Error publishing article');
    }
});
app.get('/clients', (req: Request, res: Response) => {
    const clientInfo = Array.from(wsClients).map((client, index) => ({
        id: index + 1,
        readyState: client.readyState,
    }));
    res.status(200).json(clientInfo);
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
