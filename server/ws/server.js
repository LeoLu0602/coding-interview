import { WebSocketServer } from 'ws';

const PORT = 1337;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
    console.log('client connected');

    ws.on('message', (msg) => {
        console.log(`received: ${msg}`);
        ws.send(`echo: ${msg}`);
    });

    ws.on('close', () => {
        console.log('client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
