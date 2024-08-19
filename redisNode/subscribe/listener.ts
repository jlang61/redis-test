import { createClient, RedisClientType, RedisModules, RedisFunctions, RedisScripts } from 'redis';

interface MyRedisClient extends RedisClientType<RedisModules, RedisFunctions, RedisScripts> { }

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

const initRedisSubscriber = async (channel: string) => {
    const subscriber = await connectToRedis();
    
    await subscriber.subscribe(channel, (message) => {
        console.log(`Received message from channel "${channel}":`, message);
    });

    console.log(`Subscribed to Redis channel "${channel}"`);
};

const startSubscriber = async () => {
    const channel = 'test';
    try {
        await initRedisSubscriber(channel);
    } catch (error) {
        console.error('Error while initializing subscriber:', error);
    }
};

startSubscriber();
