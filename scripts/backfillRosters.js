// scripts/backfillRosters.js
import { getAllTeams } from "../repos/teamsRepo.js";
import { fetchAndSaveRosterForTeam } from "../yahoo/fetchAndSaveRoster.js";

// simple pause to avoid hammering the API too fast
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const teams = await getAllTeams();
console.log(`Found ${teams.length} teams. Fetching rosters…`);

let ok = 0;
let fail = 0;

for (const team of teams) {
  try {
    const players = await fetchAndSaveRosterForTeam(team);
    console.log(
      `✅ ${team.name} (${team.manager}): ${players.length} players saved`
    );
    ok++;
  } catch (err) {
    console.error(`❌ ${team.name} (${team.manager}): ${err.message}`);
    fail++;
  }
  // 300ms delay per team (tweak if Yahoo is strict)
  await sleep(300);
}

console.log(`\n🎉 Done. Success: ${ok}, Failed: ${fail}`);
process.exit(0);
