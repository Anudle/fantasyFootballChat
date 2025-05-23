// utils/generateGenericRoast.js
import axios from 'axios';
import 'dotenv/config';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateRoast({ firstName, teamName, flavor, players }) {
  const playerList = players.map(p => `- ${p}`).join('\n');

  const prompt = `
You're a fantasy football commentator known for sharp wit and dry humor.
You're writing a roast for owners name: "${firstName}, team name: ${teamName}".

Here's the team's current roster:
${playerList}

${
    flavor ? `The manager is known for: ${flavor}.
` : ''
  }Write a short, clever roast (2–3 sentences). Be light-hearted but pointed. No need to mention specific player stats or projections — just go with vibes and roster decisions.`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error('❌ Error generating generic roast:', err.message);
    return 'Roast unavailable. Probably too savage to say out loud.';
  }
}
