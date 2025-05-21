// generatePrediction.js
import axios from "axios";
import "dotenv/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generatePrediction(teamA, projA, teamB, projB) {
  console.log("🔐 API Key Present:", !!process.env.GROQ_API_KEY);
  const prompt = `
Fantasy football matchup:

${teamA}: ${projA} projected points
${teamB}: ${projB} projected points

Predict the winner and add a witty, trash-talking one-liner. Keep it under 3 sentences. Feel free to throw in an upset. 

`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
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

    const message = response.data.choices[0].message.content.trim();
    return message;
  } catch (error) {
    if (error.response) {
      console.error(
        "💥 API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("⚠️ Request Error:", error.message);
    }
    return "Could not generate a prediction at this time.";
  }
}
