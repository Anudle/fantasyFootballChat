// runTuesdayRoast.mjs
import { detectLineupOffenders } from "../utils/detectLineupOffenders.js";
import { generateRoast } from "../utils/generateRoast.js";
import { teamRosters } from "../mocks/mockTeamRosters.js";
import { getCurrentFantasyWeek } from "../utils/getCurrentFantasyWeek.js";

const currentWeek = getCurrentFantasyWeek;

let worstTeam = null;
let worstOffenders = [];
const teamRostersArray = await teamRosters();
for (const team of teamRostersArray) {
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
