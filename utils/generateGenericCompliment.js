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

function samplePlayerNames(players, maxCount = 3) {
  const safe = Array.isArray(players) ? players.filter(Boolean) : [];
  const shuffled = [...safe].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(maxCount, shuffled.length));
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
  const nameDrops = samplePlayerNames(players, 3).join(", ");

  const prompt = `
You're a fantasy football commentator known for wholesome hype and positive energy.
Write an uplifting compliment for the manager "${firstName}" and team "${teamName}".

Context:
${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
    chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  }- Roster (sample):
${rosterList || "- (no notable players listed)"}

Formatting rules (follow exactly):
- Start with a one-line TL;DR that summarizes the praise in ~10–18 words. Prefix with "TL;DR:".
- After the TL;DR, add a blank line, then the full compliment body.
- Use Markdown, no code fences.

Content rules:
- 2–3 sentences in the body. Warm, punchy, and genuine.
- Keep it G-rated and inclusive. No roasting or sarcasm.
- If roster is provided, naturally work in 1–3 player names from it (${nameDrops || "none available"}).
  - Do NOT invent players; only use names from the provided roster list.
- You can lightly weave in the fun fact or home base.
`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 220,
        top_p: 0.95,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(
      "❌ Error generating compliment:",
      err?.response?.data || err.message
    );
    return "TL;DR: Compliment unavailable.\n\nBut honestly, your squad looks awesome. 🌟";
  }
}
