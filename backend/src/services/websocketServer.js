import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection');

  ws.on('message', function incoming(message) {
    console.log('Received message:', message);
  });
});

console.log('WebSocket server started on port 3000');
