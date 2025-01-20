const { Telegraf } = require('telegraf');
const WebSocket = require('ws');

// Telegram Bot Token
const BOT_TOKEN = '8158052145:AAHJo7QBL34XJIjxm4U7BEQl1e1xT_s-Mtc';
const bot = new Telegraf(BOT_TOKEN);

// WebSocket connection (Updated to connect to back-end server on port 8080)
const ws = new WebSocket('ws://localhost:8080'); // WebSocket URL for back-end server

ws.on('open', () => {
    console.log('Connected to WebSocket server on ws://localhost:8080');
});

// Handle /start command
bot.start((ctx) => {
    ctx.reply('Welcome! Use /control to control the ball.');
});

// Handle /control command
bot.command('control', (ctx) => {
    ctx.reply('Control options:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Start', callback_data: 'start' }],
                [{ text: 'Stop', callback_data: 'stop' }],
                [{ text: 'Speed Up', callback_data: 'speedUp' }],
                [{ text: 'Slow Down', callback_data: 'speedDown' }],
                [{ text: 'Reverse', callback_data: 'reverse' }],
            ],
        },
    });
});

// Handle button clicks (callback queries)
bot.on('callback_query', (ctx) => {
    const action = ctx.callbackQuery.data;
    ctx.reply(`Action: ${action}`);

    // Broadcast action to WebSocket server (back-end)
    console.log(`Bot sent: ${action}`);
    
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action }));
    }
});

// Launch the bot
bot.launch();

console.log('Telegram bot running with Telegraf...');
