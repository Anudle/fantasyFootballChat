// weeklyPredictions.js
import { mockMatchups } from "./mocks/mockMatchups.js";
import { generatePrediction } from "./utils/generatePrediction.js";

async function compileWeeklyPredictions() {
  console.log("🔥 WEEKLY MATCHUP PREDICTIONS 🔥\n");

  for (const matchup of mockMatchups) {
    const { teamA, projA, teamB, projB } = matchup;
    const prediction = await generatePrediction(teamA, projA, teamB, projB);
    console.log(`${teamA} vs. ${teamB}\n→ ${prediction}\n`);
  }
}

compileWeeklyPredictions();
