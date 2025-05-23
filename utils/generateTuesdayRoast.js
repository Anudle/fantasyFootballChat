// generateRoast.js
import axios from "axios";
import "dotenv/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateTuesdayRoast(
  teamName,
  offenders,
  funFacts,
  week = 6
) {
  const offenderList = offenders
    .map((o) => `- ${o.name} (${o.reason})`)
    .join("\n");

  // Pick a random fun fact
  const personality = funFacts[Math.floor(Math.random() * funFacts.length)];

  const prompt = `
Generate a sarcastic, funny fantasy football roast for the team "${teamName}" who is receiving the Week ${week} John Wineman Award.\n
They started these questionable players:\n${offenderList}\n
This manager is known for: ${personality}.\n
Make it playful, creative, and no more than 2 sentences.`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = await res.data.choices[0].message.content.trim();
    return `🏆 John Wineman Award: Week ${week} 🏆\n\n${message}`;
  } catch (error) {
    console.error("💥 API Error:", error.response.status, error.response.data);
    return "Could not generate a roast this time.";
  }
}
