import fs from "fs";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { refreshYahooToken } from "../refreshToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const accessToken = await refreshYahooToken(); // 🔄 Always use fresh token

const leagueKey = "449.l.438606";
const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`;

async function getLeagueData() {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const json = await res.json();
    // fs.writeFileSync(
    //   `${__dirname}/leagueData.json`,
    //   JSON.stringify(json, null, 2),
    //   'utf-8'
    // );
    console.log({ json });
    // console.log('✅ League Data written to leagueData.json');
  } catch (err) {
    console.error("❌ Error fetching league data:", err.message);
  }
}

getLeagueData();
