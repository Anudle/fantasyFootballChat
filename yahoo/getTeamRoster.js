// yahoo/getTeamRoster.js
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { refreshYahooToken } from "./refreshToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const profilesPath = path.join(__dirname, "../data/teamProfiles.json");

export async function getTeamRoster(teamKey) {
  const accessToken = await refreshYahooToken();
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster?format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();

    const players = data.fantasy_content.team[1].roster[0].players || [];

    const playerNames = Object.values(players)
      .filter((p) => p.player)
      .map((p) => p.player[0][2].name.full);

    // Read and update teamProfiles.json
    const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf-8"));
    const updatedProfiles = profiles.map((profile) =>
      profile.teamKey === teamKey
        ? { ...profile, roster: playerNames }
        : profile
    );
    fs.writeFileSync(profilesPath, JSON.stringify(updatedProfiles, null, 2));
    console.log(`✅ Updated roster in teamProfiles.json for ${teamKey}`);

    return playerNames;
  } catch (err) {
    console.error("❌ Error fetching roster:", err.message);
    return [];
  }
}

// Run manually via: node yahoo/getTeamRoster.js <teamKey>
if (process.argv[1].includes("getTeamRoster.js")) {
  const teamKey = process.argv[2];
  if (!teamKey) {
    console.error("❌ Please provide a team key");
    process.exit(1);
  }
  getTeamRoster(teamKey);
}
