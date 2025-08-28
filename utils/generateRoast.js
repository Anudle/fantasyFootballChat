// utils/generateGenericRoast.js
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

  // Build prompt
  const prompt = `
You're a fantasy football commentator known for sharp wit and dry humor.
Write a playful roast for the manager "${firstName}" and team "${teamName}".

Context:
${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
    chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  }- Roster (sample):
${rosterList || "- (no notable players listed)"}
Context:
${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
    chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  }

Instructions:
- 2–3 sentences total. Punchy and clever.
- Light-hearted, no slurs or hateful content.
- Roast their vibes, choices, or team identity; you don't need stats.
- If useful, weave in the fun fact or home base subtly.
`;

  //   const prompt = `
  // You're a fantasy football commentator known for sharp wit and dry humor.
  // Write a playful roast for the manager "${firstName}" and team "${teamName}".

  // Context:
  // ${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
  //     chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  //   }- Roster (sample):
  // ${rosterList || "- (no notable players listed)"}
  // Context:
  // ${homeLocation ? `- Home base: ${homeLocation}\n` : ""}${
  //     chosenFlavor ? `- Fun fact: ${chosenFlavor}\n` : ""
  //   }- Roster (sample):
  // ${rosterList || "- (no notable players listed)"}

  // Instructions:
  // - 2–3 sentences total. Punchy and clever.
  // - Light-hearted, no slurs or hateful content.
  // - Roast their vibes, choices, or team identity; you don't need stats.
  // - If useful, weave in the fun fact or home base subtly.
  // `;

  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 180, // enough for 2–3 zesty sentences
        top_p: 0.95,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
          // Optional: set a short timeout so your bot stays snappy
          // (Axios uses ms; adjust to taste)
          timeout: 8000,
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(
      "❌ Error generating roast:",
      err?.response?.data || err.message
    );
    return "Roast unavailable. Probably too savage to say out loud.";
  }
}
