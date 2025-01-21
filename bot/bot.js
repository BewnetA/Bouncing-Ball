const { Telegraf } = require("telegraf");
const WebSocket = require("ws");

// Telegram Bot Token
const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

// WebSocket connection
const ws = new WebSocket("wss://bouncing-ball-websocket.onrender.com");

ws.on("open", () => {
  console.log("Connected to WebSocket server.");
});

// Registration tracking
const registeredUsers = new Set();

// Handle /start command
bot.start((ctx) => {
  ctx.reply("Welcome! Please register to use the bot.", {
    reply_markup: {
      inline_keyboard: [[{ text: "Register", callback_data: "register" }]],
    },
  });
});

// Handle /controls command
bot.command("controls", (ctx) => {
  ctx.reply("Control options:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Start", callback_data: "start" },{ text: "Stop", callback_data: "stop" }],
        [{ text: "Speed Up", callback_data: "speedUp" },
            { text: "Slow Down", callback_data: "speedDown" },
            { text: "Reverse", callback_data: "reverse" }],
        [
          {
            text: "Start Web App",
            web_app: {
              url: "https://front-part-chi.vercel.app/", // Replace with your web app URL
            },
          },
        ],
      ],
    },
  });
});

// Handle callback queries
bot.on("callback_query", (ctx) => {
  const action = ctx.callbackQuery.data;

  if (action === "register") {
    const userId = ctx.from.id;

    if (registeredUsers.has(userId)) {
      ctx.reply("You are already registered!");
    } else {
      registeredUsers.add(userId);
      ctx.reply("Registration successful! Use /controls to start.");
    }
  } else if (
    ["start", "stop", "speedUp", "speedDown", "reverse"].includes(action)
  ) {
    // Broadcast action to WebSocket server (back-end)
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action }));
    }
  }
});

// Launch the bot
bot.launch();
console.log("Telegram bot running with Web App and enhanced controls...");
