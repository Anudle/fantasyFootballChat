
// runThursdayPrediction.mjs
import { getAccessToken } from '../yahoo/getAccessToken.js';
import { teamRosters } from '../mocks/mockTeamRosters.js';
import { generateGroqPrediction } from '../utils/generateGroqPrediction.js';
import { detectLineupOffenders } from '../utils/detectLineupOffenders.js';
import { mockMatchups } from '../mocks/mockMatchups.js';
import axios from 'axios';
import 'dotenv/config';

const WEEK = 6; // Simulated week
const accessToken = await getAccessToken();
const teams = await teamRosters();

for (const team of teams) {
  const offenders = detectLineupOffenders(team.players, WEEK);

  if (offenders.length > 0) {
    const message = await generateGroqPrediction({
      teamName: team.teamName,
      funFacts: team.funFacts,
      offenders,
      week: WEEK
    });

    console.log(`📣 Thursday Warning for ${team.teamName}`);
    console.log(message);
    console.log('---');
  }
}

console.log('\n🏈 Weekly Matchup Predictions:\n');

const matchupSummary = mockMatchups.map(m => `${m.teamA} (${m.projA}) vs ${m.teamB} (${m.projB})`).join("\n");

const prompt = `
Here are this week's fantasy football matchups with projected points:

${matchupSummary}

Predict the winners of each matchup. Add a clever or unexpected upset or two. Include witty trash talk and keep it under 3 sentences per matchup. Make it feel like a confident analyst with attitude.`;

try {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
    }
  );

  const predictionBlock = response.data.choices[0].message.content.trim();
  console.log(predictionBlock);
} catch (err) {
  console.error('❌ Failed to generate weekly matchup predictions:', err.message);
}
