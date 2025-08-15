import fs from "fs";
import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";

const leagueKey = "449.l.438606";
const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`;

async function getLeagueData() {
  try {
    const accessToken = await refreshYahooToken(); // always fresh
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

    // Save JSON to file in project directory
    fs.writeFileSync("./leagueData.json", JSON.stringify(json, null, 2));

    console.log("✅ League data saved to leagueData.json");
  } catch (err) {
    console.error("❌ Error fetching league data:", err.message);
  }
}

getLeagueData();
