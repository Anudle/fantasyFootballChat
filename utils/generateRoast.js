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
 * Generate a short roast using Groq (Llama 3 8B).
 *
 * @param {Object} args
 * @param {string} args.firstName - Manager first name
 * @param {string} args.teamName  - Team name
 * @param {string[]} [args.players] - Current roster (names)
 * @param {string} [args.flavor] - Single flavor fun-fact (legacy)
 * @param {string[]} [args.flavors] - Multiple flavor fun-facts (preferred)
 * @param {string} [args.homeLocation] - e.g., "Louisville, CO"
 */
export async function generateRoast({
  firstName,
  teamName,
  players = [],
  flavor,
  flavors,
  homeLocation,
}) {
  // Prefer a random from `flavors` array; fall back to single `flavor`
  const chosenFlavor = pickRandom(flavors) || flavor || "";
  const rosterList = formatRoster(players, 12);
  const nameDrops = samplePlayerNames(players, 3).join(", ");

  // Build prompt
  const prompt = `
You're a fantasy football commentator known for sharp wit and dry humor.
Write a playful roast for the manager "${firstName}" and team "${teamName}".

Context:
${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
    chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  }- Roster (sample):
${rosterList || "- (no notable players listed)"}

Formatting rules (follow exactly):
- Start with a one-line TL;DR that summarizes the roast in ~10–18 words. Prefix with "TL;DR:".
- After the TL;DR, add a blank line, then the full roast body.
- Use Markdown, no code fences.

Content rules:
- 2–3 sentences in the body. Punchy and clever.
- Light-hearted only—no slurs, hate, or personal attacks.
- If roster is provided, naturally work in 1–3 player names from it (${nameDrops || "none available"}).
  - Do NOT invent players; only use names from the provided roster list.
- You can weave in the fun fact or home base subtly if helpful.
`;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 220, // wiggle room for TL;DR + body
        top_p: 0.95,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        // Keep the bot snappy
        timeout: 8000,
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(
      "❌ Error generating roast:",
      err?.response?.data || err.message
    );
    return "TL;DR: Roast unavailable.\n\nProbably too savage to say out loud today. Try again soon. 😅";
  }
}
