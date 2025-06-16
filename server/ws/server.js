import { WebSocketServer } from 'ws';
import { v4 } from 'uuid';

const PORT = 1337;
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map();
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

                    rooms.set(roomId, [
                        waiting,
                        {
                            ws,
                            userId,
                        },
                    ]);

                    waiting = null;
                    console.log(rooms, waiting);

                    const resStr = JSON.stringify({
                        type: 'matchResponse',
                        payload: {
                            roomId,
                        },
                    });

                    rooms.get(roomId)[0].ws.send(resStr);
                    rooms.get(roomId)[1].ws.send(resStr);
                } else {
                    waiting = {
                        ws,
                        userId,
                    };
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
