import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';
import commandLineArgs from 'command-line-args';

interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> { }

const optionDefinitions = [
    { name: 'port', alias: 'p', type: Number }
]
const options = commandLineArgs(optionDefinitions)
const port = options['port'];

const app = express();

app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const wsClients: Set<WebSocket> = new Set();

const broadcastMessage = (message: string) => {
    wsClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};
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

const initRedisSubscriber = async () => {
    const subscriber = await connectToRedis();
    await subscriber.subscribe('all', (message) => {
        console.log('Broadcasting message from Redis:', message);
        broadcastMessage(message);
    });
};

app.post('/publish', async (req: Request, res: Response) => {
    const article = {
        id: req.body.id || '123456',
        name: req.body.name || 'Testing publish',
    };

    try {
        const publisher = await connectToRedis();
        // article is the 'key' that tells you which channel to publish to 
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
// per alexey's request to be able to broadcast message to all connected clients when a new client connects
let publisher: MyRedisClient | undefined

wss.on('connection', async (ws: WebSocket) => {
    wsClients.add(ws);
    console.log('WebSocket added');

    let channel: string[] = [];
    let subscriber: MyRedisClient | undefined;

    ws.on('message', async (message) => {
        const splitted = message.toString().split(" ", 3);
        const command = splitted[0].toLowerCase();
        const channelName = splitted[1]?.toLowerCase();
        
        if (command === 'subscribe' && channelName) {
            if (!subscriber) {
                subscriber = await connectToRedis();
            }

            if (!channel.includes(channelName)) {
                channel.push(channelName);
                await subscriber.subscribe(channelName, (redisMessage) => {
                    ws.send(redisMessage);
                });
                console.log(`Subscribed to channel '${channelName}'`);
            }
        } 
        else if (command === 'send' && channel.includes(channelName)) {
            const mes = splitted[2];
            if (mes && publisher) {
                await publisher.publish(channelName, mes);
                console.log(`Published message to channel '${channelName}': ${mes}`);
            }
        } 
        else if (command === 'unsubscribe' && channelName) {
            const index = channel.indexOf(channelName);
            if (index > -1) {
                channel.splice(index, 1);
                await subscriber?.unsubscribe(channelName);
                console.log(`Unsubscribed from channel '${channelName}'`);
            }
        }

        console.log("Current Channels: ", channel);
    });

    ws.on('close', async () => {
        wsClients.delete(ws);
        if (subscriber) {
            for (const ch of channel) {
                await subscriber.unsubscribe(ch);
            }
            await subscriber.quit();
        }
        console.log('WebSocket closed and unsubscribed from all channels');
    });
});



server.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await initRedisSubscriber();
    publisher = await connectToRedis()
});
