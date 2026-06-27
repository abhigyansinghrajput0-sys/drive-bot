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
const { google } = require("googleapis");
const axios = require("axios");
const streamifier = require("streamifier");
const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const drive = google.drive({
  version: "v3",
  auth
});

bot.on("document", async (msg) => {
  try {
    const file = await bot.getFile(msg.document.file_id);

    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer"
    });

    const upload = await drive.files.create({
      requestBody: {
        name: msg.document.file_name
      },
      media: {
        mimeType: msg.document.mime_type,
        body: streamifier.createReadStream(Buffer.from(response.data))
      }
    });

    bot.sendMessage(
      msg.chat.id,
      `✅ Upload successful!\nhttps://drive.google.com/file/d/${upload.data.id}/view`
    );
  } catch (err) {
    console.log(err);
    bot.sendMessage(msg.chat.id, "❌ Upload failed.");
  }
});
