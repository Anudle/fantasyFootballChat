// generateGroqPrediction.js
import axios from "axios";
import "dotenv/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateGroqPrediction({
  teamName,
  funFacts,
  offenders,
  week,
}) {
  const offenderList = offenders
    .map((o) => `- ${o.name} (${o.reason})`)
    .join("\n");
  const flavor = funFacts.join(", ");

  const prompt = `
You're an expert fantasy football analyst with a dry sense of humor. It's Thursday of Week ${week}.\n
The team "${teamName}" has some questionable lineup decisions:\n${offenderList}\n
The manager is known for: ${flavor}.\n
Write a short, clever 2–3 sentence blurb predicting this team's fate this week — ideally with a light warning or jab. Avoid being mean. Be fun.`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-8b-8192",
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

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ Error generating Groq prediction:", err.message);
    return "Prediction could not be generated at this time.";
  }
}
