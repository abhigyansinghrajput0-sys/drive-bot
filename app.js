const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Telegram Bot is Running!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Yahan se aapka bot chalu hoga
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome Bhai Abhigyan! Aapka Cloud Drive Bot active hai.");
});

