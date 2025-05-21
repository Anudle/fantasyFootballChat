// runThursdayPrediction.mjs
// import { getAccessToken } from "./getAccessToken.js";
import { teamRosters } from "./mocks/mockTeamRosters.js";
import { generateGroqPrediction } from "./generateGroqPrediction.js";
import { detectLineupOffenders } from "./detectLineupOffenders.js";

const WEEK = 6; // adjust this manually or automate if needed

// const accessToken = await getAccessToken();
const teams = await teamRosters();

for (const team of teams) {
  const offenders = detectLineupOffenders(team.players, WEEK);

  if (offenders.length > 0) {
    const message = await generateGroqPrediction({
      teamName: team.teamName,
      funFacts: team.funFacts,
      offenders,
      week: WEEK,
    });

    console.log(`📣 Thursday Warning for ${team.teamName}`);
    console.log(message);
    console.log("---");
  }
}
