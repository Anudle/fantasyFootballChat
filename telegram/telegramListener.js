// telegram/telegramListener.js
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { generateRoast } from "../utils/generateRoast.js";
import { getTeamRoster } from "../yahoo/getTeamRoster.js";
import fs from "fs";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

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
