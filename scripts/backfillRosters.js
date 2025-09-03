import { getAllTeams } from "../repos/teamsRepo.js";
import { fetchAndSaveRosterForTeam } from "../yahoo/fetchAndSaveRoster.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const teams = await getAllTeams();
console.log(`Found ${teams.length} teams. Fetching rosters…`);

let ok = 0,
  fail = 0;

for (const team of teams) {
  try {
    const players = await fetchAndSaveRosterForTeam(team);
    const count = Array.isArray(players) ? players.length : 0;
    console.log(`✅ ${team.name} (${team.manager}): ${count} players saved`);
    ok++;
  } catch (err) {
    console.error(`❌ ${team.name} (${team.manager}):`, err?.message || err);
    // Optional: verbose
    if (err?.stack) console.error(err.stack);
    fail++;
  }
  await sleep(300);
}

console.log(`\n🎉 Done. Success: ${ok}, Failed: ${fail}`);
process.exit(0);
