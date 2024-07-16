import { createClient } from 'redis';

(async () => {
  const publisher = createClient();

  const article = {
    id: '123456',
    name: 'Testing publish',
  };

  await publisher.connect();

  await publisher.publish('article', JSON.stringify(article));

  await publisher.quit();
})();