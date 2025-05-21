// sendTelegramMessage.js
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export async function sendTelegramMessage(
  text,
  chatId = process.env.TELEGRAM_CHAT_ID
) {
  try {
    await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
    console.log(`📤 Sent message to chat ID ${chatId}`);
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err.message);
  }
}
