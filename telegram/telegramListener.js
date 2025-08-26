// telegram/telegramListener.js
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { generateRoast } from "../utils/generateRoast.js";
import { getTeamRoster } from "../yahoo/getTeamRoster.js";
import fs from "fs";


const tail = (s) => (s ? s.slice(-6) : "missing");
console.log("TOKEN tail:", tail(process.env.TELEGRAM_BOT_TOKEN));

console.log(
  "BOOT: running telegramListener.js in POLLING mode @",
  new Date().toISOString()
);
import axios from "axios";
const token = process.env.TELEGRAM_BOT_TOKEN;
await axios.post(`https://api.telegram.org/bot${token}/deleteWebhook`);
console.log("BOOT: webhook deleted");

// ✅ POLLING ONLY
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: { interval: 3000, params: { timeout: 50 } },
});

bot.getMe().then((me) => console.log("Connected as @" + me.username));

console.log("🤖 Telegram worker started: polling…");
// Load teamProfiles once
const teamProfiles = JSON.parse(
  fs.readFileSync("./data/teamProfiles.json", "utf-8")
);

const nameToTeamMap = {};
teamProfiles.forEach((profile) => {
  if (!profile.firstName) return;
  const key = profile.firstName.toLowerCase();
  nameToTeamMap[key] = {
    teamKey: profile.teamKey,
    teamName: profile.teamName,
    flavor:
      profile.funFacts?.[Math.floor(Math.random() * profile.funFacts.length)] ||
      "",
    staticRoster: profile.roster || [],
  };
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text.startsWith("hey bot roast ")) {
    const firstName = text.replace("hey bot roast ", "").trim().toLowerCase();
    const mapEntry = nameToTeamMap[firstName];

    if (!mapEntry) {
      return bot.sendMessage(
        chatId,
        `😬 Couldn't find a team for "${firstName}".`
      );
    }

    const players = mapEntry.staticRoster.length
      ? mapEntry.staticRoster
      : await getTeamRoster(mapEntry.teamKey);

    const roast = await generateRoast({
      firstName,
      teamName: mapEntry.teamName,
      flavor: mapEntry.flavor,
      players,
    });

    bot.sendMessage(chatId, `🔥 Roast for ${mapEntry.teamName}:\n\n${roast}`);
  }
});
