// ws-server.ts
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { RedisSub } from './redis';

// Keep track of connected clients
const wss = new WebSocketServer({ noServer: true });
const clients = new Set<WebSocket>();

// On new client connection
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Redis subscribe
await RedisSub.subscribe('trade-updates', (err, count) => {
  if (err) {
    console.error('Error subscribing to trade-updates:', err);
  } else {
    console.log(`Subscribed to ${count} channels`);
  }
});

RedisSub.on('message', (channel, message) => {
  if (channel === 'trade-updates') {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
});

// Hook into HTTP server upgrade
export function handleUpgrade(server: any) {
  server.on('upgrade', (req: any, socket: any, head: any) => {
    if (req.url === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req); // ✅ Correct
      });
    }
  });
}
