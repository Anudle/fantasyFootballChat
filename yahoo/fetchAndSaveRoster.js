import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";
import { replaceRoster } from "../repos/rostersRepo.js";
import { updateTeamKeys } from "../repos/teamsRepo.js";
import { resolve2025LeagueAndTeam } from "./resolve2025LeagueAndTeam.js";

function extractNames(playersNode) {
  if (!playersNode || typeof playersNode !== "object") return [];
  const names = [];
  for (const node of Object.values(playersNode)) {
    const arr = node?.player?.[0];
    if (!Array.isArray(arr)) continue;
    const name = arr.find((x) => x?.name?.full)?.name?.full;
    if (name) names.push(name.trim());
  }
  return Array.from(new Set(names));
}

export async function fetchAndSaveRosterForTeam(team) {
  const { team_key, league_key, season } = await resolve2025LeagueAndTeam({
    teamNameHint: team.name,
    managerNicknameHint: team.manager,
  });

  await updateTeamKeys(team.id, { season, team_key, league_key });

  const token = await refreshYahooToken();
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${team_key}/roster?format=json`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Yahoo roster fetch failed (${res.status})`);

  const data = await res.json();
  const playersNode =
    data?.fantasy_content?.team?.["1"]?.roster?.["0"]?.players;
  const names = extractNames(playersNode); // pre-draft this will be []

  await replaceRoster(team.id, names);
  return names;
}
