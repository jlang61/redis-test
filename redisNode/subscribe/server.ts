import { createClient } from 'redis';

(async () => {
  const client = createClient();

  const subscriber = client.duplicate();

  await subscriber.connect();

  await subscriber.subscribe('article', (message: string) => {
    console.log(message); // 'message'
  });

  process.on('SIGINT', async () => {
    await subscriber.unsubscribe('article');
    await subscriber.quit();
    process.exit();
  });
})();