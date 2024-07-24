import express, { Request, Response } from 'express';
import { createClient, RedisClientType } from 'redis';

const app = express();
const port = 3000;

app.use(express.json());

const connectToRedis = async (): Promise<RedisClientType> => {
  try {
    const client: RedisClientType = createClient();
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
    res.status(200).send('Article published');
  } catch (error) {
    console.error('Error publishing article:', error);
    res.status(500).send('Error publishing article');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});