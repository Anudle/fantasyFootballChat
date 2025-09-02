// telegram/telegramListener.js
import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { generateRoast } from "../utils/generateRoast.js"; // <-- confirm filename/export
import { generateCompliment } from "../utils/generateGenericCompliment.js"; // <-- confirm filename/export
import { buildRoastContext } from "../services/buildRoastContext.js";
import { getAllTeams, getTeamByManagerFirstName } from "../repos/teamsRepo.js";
import { fetchAndSaveRosterForTeam } from "../yahoo/fetchAndSaveRoster.js";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error("❌ Missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: { interval: 3000, params: { timeout: 50 } },
});

bot
  .getMe()
  .then((me) => console.log("✅ Connected as @" + me.username))
  .catch((err) =>
    console.error("❌ getMe failed:", err?.response?.data || err.message)
  );

console.log("🤖 Telegram worker started: polling…");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const raw = (msg.text || "").trim();
  const lower = raw.toLowerCase();

  // --- quick ping to validate updates
  if (lower === "/ping") {
    return bot.sendMessage(chatId, "pong");
  }

  // --- ROAST: "hey bot roast jason"
  if (lower.startsWith("hey bot roast ")) {
    try {
      console.log("🔔 Roast request:", raw);
      const first = raw.slice("hey bot roast ".length).trim();
      console.log("[roast] parsed first name:", first);
      const ctx = await buildRoastContext({ managerFirstName: first });
      console.log("[roast] ctx:", {
        found: !!ctx,
        teamName: ctx?.teamName,
        manager: ctx?.manager,
        rosterCount: ctx?.roster?.length,
      });
      if (!ctx)
        return bot.sendMessage(
          chatId,
          `😬 Couldn't find a team for "${first}".`
        );

      const roast = await generateRoast({
        firstName: ctx.manager,
        teamName: ctx.teamName,
        players: ctx.roster,
        flavors: ctx.flavors,
        homeLocation: ctx.homeLocation,
      });

      return bot.sendMessage(
        chatId,
        `🔥 Roast for ${ctx.teamName}:\n\n${roast}`
      );
    } catch (e) {
      console.error("roast handler:", e);
      return bot.sendMessage(chatId, "⚠️ Roast failed. Try again in a bit.");
    }
  }

  // --- COMPLIMENT: compliment / hype / praise / glaze
  if (
    lower.startsWith("hey bot compliment") ||
    lower.startsWith("hey bot hype") ||
    lower.startsWith("hey bot praise") ||
    lower.startsWith("hey bot glaze")
  ) {
    try {
      console.log("🔔 Compliment request:", raw);
      const name = raw
        .replace(/^hey bot (compliment|hype|praise|glaze)\s*/i, "")
        .trim();
      if (!name) {
        return bot.sendMessage(
          chatId,
          "🌟 Who should I hype up? Try: `hey bot compliment jason`"
        );
      }

      const ctx = await buildRoastContext({ managerFirstName: name });
      console.log("[compliment] ctx:", {
        input: name,
        found: !!ctx,
        teamName: ctx?.teamName,
        manager: ctx?.manager,
        rosterCount: ctx?.roster?.length,
      });
      if (!ctx)
        return bot.sendMessage(
          chatId,
          `😬 Couldn't find a team for "${name}".`
        );

      const compliment = await generateCompliment({
        firstName: ctx.manager,
        teamName: ctx.teamName,
        players: ctx.roster,
        flavors: ctx.flavors,
        homeLocation: ctx.homeLocation,
      });

      return bot.sendMessage(
        chatId,
        `🌟 Hype for ${ctx.teamName}:\n\n${compliment}`
      );
    } catch (e) {
      console.error("compliment handler:", e);
      return bot.sendMessage(
        chatId,
        "⚠️ Compliment failed. Try again in a bit."
      );
    }
  }

  // --- /refresh all
  if (lower === "/refresh all") {
    try {
      const teams = await getAllTeams();
      let ok = 0,
        fail = 0;
      for (const t of teams) {
        try {
          await fetchAndSaveRosterForTeam(t);
          ok++;
        } catch (e) {
          console.error("refresh all item:", t.team_key, e.message);
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
    } catch (e) {
      console.error("refresh all:", e);
      return bot.sendMessage(chatId, "⚠️ Refresh all failed.");
    }
  }

  // --- /refresh <firstName>
  if (lower.startsWith("/refresh ")) {
    try {
      const who = raw.slice("/refresh ".length).trim();
      const team = await getTeamByManagerFirstName(who);
      if (!team) return bot.sendMessage(chatId, `No team for "${who}"`);
      const names = await fetchAndSaveRosterForTeam(team);
      return bot.sendMessage(
        chatId,
        `🔁 Refreshed ${team.name} — ${names.length} players cached`
      );
    } catch (e) {
      console.error("refresh:", e);
      return bot.sendMessage(chatId, "⚠️ Refresh failed.");
    }
  }

  // --- /debug <firstName>
  if (lower.startsWith("/debug ")) {
    const who = raw.slice("/debug ".length).trim();
    const ctx = await buildRoastContext({ managerFirstName: who }).catch(
      () => null
    );
    return bot.sendMessage(
      chatId,
      "🧪 Debug:\n" +
        "input: " +
        who +
        "\n" +
        "found: " +
        !!ctx +
        "\n" +
        (ctx
          ? `team: ${ctx.teamName}\nmanager: ${ctx.manager}\nroster: ${ctx.roster?.length} players`
          : "no context")
    );
  }
});
