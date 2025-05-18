import axios from "axios";
import "dotenv/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile"; // You can choose other models as well

export default async function generateTrashTalk(teamA, scoreA, teamB, scoreB) {
  const winner = scoreA > scoreB ? teamA : teamB;
  const loser = scoreA > scoreB ? teamB : teamA;
  const margin = Math.abs(scoreA - scoreB).toFixed(1);

  const prompt = `
Write a clever, funny fantasy football roast based on this matchup:
- ${teamA}: ${scoreA}
- ${teamB}: ${scoreB}
${winner} beat ${loser} by ${margin} points. Keep it under 50 words and make it playful.
`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.choices[0]?.message?.content;
    return message ? message.trim() : "No roast generated.";
  } catch (error) {
    console.error("❌ Error generating trash talk:", error.message);
    return "Could not generate a roast this time.";
  }
}
