const WebSocket = require('ws');
const { websocketPort } = require('./config');

const wss = new WebSocket.Server({ port: websocketPort });

wss.on('connection', (ws) => {
    console.log('Client connected.');

    ws.on('message', (message)  => {
        const data = JSON.parse(message);
        console.log('Message received:', data);
        console.log('Message received from bot:', data);

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});

console.log(`WebSocket server running on ws://localhost:${websocketPort}`);
