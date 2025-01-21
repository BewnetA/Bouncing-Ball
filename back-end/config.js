module.exports = {
    telegramToken: process.env.TELEGRAM_TOKEN,  // No need for a .env file, you can set this directly in Render
    websocketPort: process.env.PORT || 8080,    // Use Render's default port
};