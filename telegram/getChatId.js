import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  console.log("👤 Chat ID:", msg.chat.id);
  console.log(
    "📛 Chat Title or Name:",
    msg.chat.title || msg.chat.username || msg.chat.first_name
  );
  bot.sendMessage(msg.chat.id, "✅ Chat ID received!");
});
