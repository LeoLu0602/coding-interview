import { WebSocketServer } from 'ws';
import { v4 } from 'uuid';

const PORT = 1337;
const wss = new WebSocketServer({ port: PORT });
let waiting = null;

wss.on('connection', (ws) => {
    console.log('client connected');

    ws.on('message', (msg) => {
        console.log(`received: ${msg}`);

        const { type, payload } = JSON.parse(msg);
        const { userId } = payload;

        switch (type) {
            case 'matchRequest':
                if (waiting) {
                    const roomId = v4();
                    const resStr = JSON.stringify({
                        type: 'matchResponse',
                        payload: {
                            roomId,
                        },
                    });

                    waiting.send(resStr);
                    ws.send(resStr);
                    waiting = null;
                    console.log(waiting);
                } else {
                    waiting = ws;
                    console.log('a user is waiting...');
                }

                break;
            default:
                break;
        }
    });

    ws.on('close', () => {
        console.log('client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
