// utils/generateGenericCompliment.js
import axios from "axios";
import "dotenv/config";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Small helpers
function pickRandom(arr) {
  return Array.isArray(arr) && arr.length
    ? arr[Math.floor(Math.random() * arr.length)]
    : null;
}

function formatRoster(players, limit = 12) {
  const safe = Array.isArray(players) ? players.filter(Boolean) : [];
  const trimmed = safe.slice(0, limit);
  const lines = trimmed.map((p) => `- ${p}`).join("\n");
  const omitted =
    safe.length > limit ? `\n…and ${safe.length - limit} more` : "";
  return lines + omitted;
}

/**
 * Generate a short team compliment using Groq (Llama 3 8B).
 * Mirrors generateRoast() signature for easy swap.
 *
 * @param {Object} args
 * @param {string} args.firstName
 * @param {string} args.teamName
 * @param {string[]} [args.players]
 * @param {string} [args.flavor]
 * @param {string[]} [args.flavors]
 * @param {string} [args.homeLocation] - e.g., "Louisville, CO"
 */
export async function generateCompliment({
  firstName,
  teamName,
  players = [],
  flavor,
  flavors,
  homeLocation,
}) {
  const chosenFlavor = pickRandom(flavors) || flavor || "";
  const rosterList = formatRoster(players, 12);

  const prompt = `
You're a fantasy football commentator known for wholesome hype and positive energy.
Write an uplifting compliment for the manager "${firstName}" and team "${teamName}".

Context:
${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
    chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  }- Roster (sample):
${rosterList || "- (no notable players listed)"}

Instructions:
- 2–3 sentences total. Warm, punchy, and genuine.
- Keep it G-rated and inclusive. No roasting or sarcasm.
- Compliment the manager's strategy, vibe, or team identity (no stats required).
- If useful, lightly weave in the fun fact or home base.
`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 180, // enough for 2–3 sentences
        top_p: 0.95,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
          timeout: 8000,
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(
      "❌ Error generating compliment:",
      err?.response?.data || err.message
    );
    return "Compliment unavailable… but trust me, your squad looks awesome. 🌟";
  }
}
