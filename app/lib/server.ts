import { createServer } from 'http';
import next from 'next';
import { handleUpgrade } from './ws-server';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handler(req, res));
  handleUpgrade(server); // Attach WS

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
