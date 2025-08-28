// yahoo/resolve2025LeagueAndTeam.js
import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";

// helper: safely pick values under objects-with-numeric-keys
function valuesOf(obj) {
  return obj && typeof obj === "object" ? Object.values(obj) : [];
}

// helper: extract team_key from a team node (team node is something like { team: [ {...}, {...}, ... ] })
// Add helpers to read name + first manager nickname from a team node
function getYahooTeamName(teamNode) {
  const arr = teamNode?.team?.[0];
  if (!Array.isArray(arr)) return null;
  return arr.find((x) => x?.name)?.name ?? null;
}
function getYahooManagerNickname(teamNode) {
  const arr = teamNode?.team?.[0];
  if (!Array.isArray(arr)) return null;
  const managers = arr.find((x) => x?.managers)?.managers;
  // managers looks like { "0": { manager: [ {manager_id:..}, {nickname:..}, ... ] }, count: 1 }
  const first = managers && (managers["0"]?.manager || managers[0]?.manager);
  if (!Array.isArray(first)) return null;
  const nickObj = first.find((m) => m?.nickname);
  return nickObj?.nickname ?? null;
}

// Normalize strings for safer matching
function norm(s) {
  return (s || "").toString().trim().toLowerCase();
}

function getTeamKeyFromTeamNode(teamNode) {
  const arr = teamNode?.team?.[0];
  if (!Array.isArray(arr)) return null;

  // Common spots:
  // 1) direct: { team_key: "461.l.920161.t.5" }
  const direct = arr.find((x) => x?.team_key)?.team_key;
  if (direct) return direct;

  // 2) sometimes first element carries meta (team_key/team_id)
  const meta = arr[0];
  if (meta?.team_key) return meta.team_key;

  // 3) brute-force scan any nested object that looks like a key
  for (const it of arr) {
    if (it && typeof it === "object" && "team_key" in it) {
      return it.team_key;
    }
  }
  return null;
}

// helper: detect "this is my team"
function isMyTeam(teamNode) {
  const arr = teamNode?.team?.[0];
  if (!Array.isArray(arr)) return false;

  // Yahoo sometimes uses "is_owned_by_current_login" or "is_owned_by_current_team"
  const owned =
    arr.find((x) => x?.is_owned_by_current_login)?.is_owned_by_current_login ??
    arr.find((x) => x?.is_owned_by_current_team)?.is_owned_by_current_team ??
    arr.find((x) => x?.is_owned_by_current_login === 1)
      ?.is_owned_by_current_login;

  // Normalize truthiness (can be "1", 1, true)
  return owned === "1" || owned === 1 || owned === true;
}

function get2025GameKey(gamesJson) {
  const gamesObj =
    gamesJson?.fantasy_content?.users?.["0"]?.user?.[1]?.games || null;
  const firstGameNode = gamesObj?.["0"]?.game?.[0];
  if (firstGameNode?.code === "nfl" && firstGameNode?.season === "2025") {
    return firstGameNode.game_key;
  }
  for (const v of Object.values(gamesObj || {})) {
    const g = v?.game?.[0];
    if (g?.code === "nfl" && g?.season === "2025") return g.game_key;
  }
  throw new Error("NFL 2025 game_key not found");
}

export async function resolve2025LeagueAndTeam({
  leagueNameOrId,
  teamNameHint,
  managerNicknameHint,
} = {}) {
  const token = await refreshYahooToken();

  // games for 2025
  const gamesRes = await fetch(
    "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;seasons=2025?format=json",
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!gamesRes.ok) throw new Error(`games ${gamesRes.status}`);
  const gamesJson = await gamesRes.json();
  const game_key = get2025GameKey(gamesJson); // "461"

  // leagues for that game
  const leaguesRes = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${game_key}/leagues?format=json`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!leaguesRes.ok) throw new Error(`leagues ${leaguesRes.status}`);
  const leaguesJson = await leaguesRes.json();

  const leaguesObj =
    leaguesJson?.fantasy_content?.users?.["0"]?.user?.[1]?.games?.["0"]
      ?.game?.[1]?.leagues;
  const leagues = Object.values(leaguesObj || {})
    .filter((x) => x?.league)
    .map((x) => x.league?.[0]);

  const league =
    leagues.find(
      (l) =>
        String(l.league_id) === String(leagueNameOrId) ||
        l.name === leagueNameOrId
    ) || leagues[0];
  if (!league) throw new Error("No 2025 league found");
  const league_key = league.league_key;

  // teams in that league
  const teamsRes = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/${league_key}/teams?format=json`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!teamsRes.ok) throw new Error(`teams ${teamsRes.status}`);
  const teamsJson = await teamsRes.json();
  const teamsObj = teamsJson?.fantasy_content?.league?.["1"]?.teams;
  const teamNodes = valuesOf(teamsObj).filter((x) => x?.team);

  // 1) Try to match by team name
  let targetTeamNode =
    teamNodes.find((n) => norm(getYahooTeamName(n)) === norm(teamNameHint)) ||
    // 2) Try to match by manager nickname
    teamNodes.find(
      (n) => norm(getYahooManagerNickname(n)) === norm(managerNicknameHint)
    ) ||
    // 3) If still not found, pick "my team" if available
    teamNodes.find(isMyTeam) ||
    // 4) Last resort: first team (but this is what caused the duplicate before)
    teamNodes[0];

  if (!targetTeamNode) throw new Error("No team nodes found in 2025 league");

  const team_key = getTeamKeyFromTeamNode(targetTeamNode);
  if (!team_key) {
    console.dir(targetTeamNode, { depth: null });
    throw new Error("Could not extract team_key from 2025 team node");
  }

  return { season: "2025", game_key, league_key, team_key };
}
