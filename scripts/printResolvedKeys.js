import "dotenv/config";
import { resolve2025LeagueAndTeam } from "../yahoo/resolve2025LeagueAndTeam.js";

try {
  const keys = await resolve2025LeagueAndTeam(); // optionally pass { leagueNameOrId: "Your League Name" }
  console.log("Resolved:", keys);
} catch (e) {
  console.error("Resolve error:", e.message);
}
