const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const token = process.env.TELEGRAM_KEY;

// bot = new TelegramBot(token);
bot = new TelegramBot(token, { polling: true });
console.log('running')
bot.on("text", async (ctx) => {
  const chat_id = ctx.chat.id;
  const string = ctx.text.toLowerCase();
  const name = ctx.from.first_name.toLowerCase();

  if (string.includes("hey bot")) {
    const prompt = string.split("hey bot")[1].trim();
    response = await axios
      .post(
        process.env.OPENAI_API_URL,
        {
          prompt: prompt,
          model: process.env.OPENAI_MODEL,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error.response.data);
      });
    if (response?.data?.choices[0] && response?.data?.choices[0]?.text) {
      response = response.data.choices[0].text;
    } else {
      response = "sorry something went wrong";
    }
    console.log({ response });
    bot.sendMessage(chat_id, response);
  }
});
