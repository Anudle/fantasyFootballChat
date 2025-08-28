// yahoo/getLeagueInfo.js
import fs from "fs";
import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";
import { resolveSeasonKeys } from "./resolveSeasonKeys.js";

async function getLeagueData() {
  try {
    const { league_key, season } = await resolveSeasonKeys({ season: "2025" });
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${league_key}/teams?format=json`;

    const accessToken = await refreshYahooToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} – ${text}`);
    }

    const json = await res.json();
    fs.writeFileSync(`./leagueData-${season}.json`, JSON.stringify(json, null, 2));
    console.log(`✅ League data saved to leagueData-${season}.json`);
  } catch (err) {
    console.error("❌ Error fetching league data:", err.message);
  }
}

getLeagueData();
