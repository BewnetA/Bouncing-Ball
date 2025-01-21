const WebSocket = require('ws');
const { websocketPort } = require('./config');

const wss = new WebSocket.Server({ port: websocketPort });

// Store user-to-client associations (mapping userId to WebSocket connection)
const userConnections = new Map();

wss.on('connection', (ws, req) => {
    console.log('Client connected.');
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Message received:', data);

        // Handle action received from the bot
        const { action, userId } = data;

        // Store the WebSocket connection associated with the userId
        userConnections.set(userId, ws);
        
        // Broadcast the action to the web app 
        const userClient = userConnections.get(userId);
        if (userClient && userClient.readyState === WebSocket.OPEN) {
            userClient.send(JSON.stringify({ action, userId }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
        // Clean up the connection when a client disconnects
        userConnections.forEach((client, userId) => {
            if (client === ws) {
                userConnections.delete(userId);
            }
        });
    });
});

console.log(`WebSocket server running on ws://localhost:${websocketPort}`);
