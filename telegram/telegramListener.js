// telegram/telegramListener.js
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { generateRoast } from "../utils/generateRoast.js";
import { buildRoastContext } from "../services/buildRoastContext.js";
import { getAllTeams, getTeamByManagerFirstName } from "../repos/teamsRepo.js";
import { fetchAndSaveRosterForTeam } from "../yahoo/fetchAndSaveRoster.js";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: { interval: 3000, params: { timeout: 50 } },
});

bot.getMe().then((me) => console.log("Connected as @" + me.username));
console.log("🤖 Telegram worker started: polling…");

// --- ROAST: "hey bot roast jason"
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const raw = (msg.text || "").trim();
  const lower = raw.toLowerCase();

  // 1) roast
  if (lower.startsWith("hey bot roast ")) {
    console.log("🔔 Roast request:", raw);
    const first = raw.slice("hey bot roast ".length).trim();
    const ctx = await buildRoastContext({ managerFirstName: first });
    if (!ctx)
      return bot.sendMessage(chatId, `😬 Couldn't find a team for "${first}".`);

    const roast = await generateRoast({
      firstName: ctx.manager,
      teamName: ctx.teamName,
      players: ctx.roster,
      flavors: ctx.flavors,
      homeLocation: ctx.homeLocation,
    });

    return bot.sendMessage(chatId, `🔥 Roast for ${ctx.teamName}:\n\n${roast}`);
  }

  // 2) /refresh all
  if (lower === "/refresh all") {
    const teams = await getAllTeams();
    let ok = 0,
      fail = 0;
    for (const t of teams) {
      try {
        await fetchAndSaveRosterForTeam(t);
        ok++;
      } catch (e) {
        console.error("refresh all:", t.team_key, e.message);
        fail++;
      }
      await new Promise((r) => setTimeout(r, 300)); // polite
    }
    return bot.sendMessage(
      chatId,
      `🔁 Refreshed ${ok}/${teams.length} rosters${
        fail ? `, ${fail} failed` : ""
      }.`
    );
  }

  // 3) /refresh <firstName>
  if (lower.startsWith("/refresh ")) {
    const who = raw.slice("/refresh ".length).trim();
    const team = await getTeamByManagerFirstName(who);
    if (!team) return bot.sendMessage(chatId, `No team for "${who}"`);
    try {
      const names = await fetchAndSaveRosterForTeam(team);
      return bot.sendMessage(
        chatId,
        `🔁 Refreshed ${team.name} — ${names.length} players cached`
      );
    } catch (e) {
      console.error("refresh:", e);
      return bot.sendMessage(chatId, `⚠️ Refresh failed for ${team.name}`);
    }
  }
});
