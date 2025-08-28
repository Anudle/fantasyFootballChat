import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";
import { getRosterForTeamId, replaceRoster } from "../repos/rostersRepo.js";
import { touchRosterSync, updateTeamKeys } from "../repos/teamsRepo.js";
import { resolve2025LeagueAndTeam } from "./resolve2025LeagueAndTeam.js";

export async function getRosterCached(team) {
  // Step 1: resolve 2025 keys
  const { team_key, league_key } = await resolve2025LeagueAndTeam({
    leagueNameOrId: team.league_id_or_name,
  });

  // Step 2: persist in DB
  await updateTeamKeys(team.id, {
    season: "2025",
    team_key,
    league_key,
  });

  // Step 3: fetch roster from Yahoo
  const token = await refreshYahooToken();
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${team_key}/roster?format=json`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Yahoo roster fetch failed: ${res.status}`);

  const data = await res.json();
  const players = data?.fantasy_content?.team?.["1"]?.roster?.["0"]?.players || {};

  const normalized = Object.values(players)
    .filter((p) => p?.player)
    .map((node) => {
      const arr = node.player?.[0] || [];
      const name = arr.find((x) => x?.name?.full)?.name?.full || null;
      const key = (arr.find((x) => x?.player_key) || arr[0])?.player_key || null;
      const elig = arr.find((x) => x?.eligible_positions)?.eligible_positions;
      const pos = Array.isArray(elig) ? elig?.[0]?.position ?? null : null;
      return name ? { player_name: name.trim(), player_key: key, position: pos } : null;
    })
    .filter(Boolean);

  await replaceRoster(team.id, normalized);
  await touchRosterSync(team.id);

  return normalized.map((p) => p.player_name);
}
