// runTuesdayRoast.mjs
import { detectLineupOffenders } from "./detectLineupOffenders.js";
import { generateRoast } from "./generateRoast.js";
import { teamRosters } from "./mocks/mockTeamRosters.js";

const currentWeek = 7;

let worstTeam = null;
let worstOffenders = [];

for (const team of teamRosters) {
  const offenders = detectLineupOffenders(team.players, currentWeek);

  if (offenders.length > worstOffenders.length) {
    worstTeam = team;
    worstOffenders = offenders;
  }
}

if (worstTeam) {
  const roast = await generateRoast(
    worstTeam.teamName,
    worstOffenders,
    worstTeam.funFacts,
    currentWeek
  );
  console.log(roast);
} else {
  console.log("No major lineup issues this week. Shocking.");
}
