// runTuesdayRoast.mjs
import { detectLineupOffenders } from "../utils/detectLineupOffenders.js";
import { generateTuesdayRoast } from "../utils/generateTuesdayRoast.js";
import { teamRosters } from "../mocks/mockTeamRosters.js";
import { getCurrentFantasyWeek } from "../utils/getCurrentFantasyWeek.js";

// const currentWeek = getCurrentFantasyWeek;
const currentWeek = 6; // Simulated week

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
  const roast = await generateTuesdayRoast(
    worstTeam.teamName,
    worstOffenders,
    worstTeam.funFacts,
    currentWeek
  );
  console.log(roast);
} else {
  console.log("No major lineup issues this week. Shocking.");
}
