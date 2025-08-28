// yahoo/resolveSeasonKeys.js
import fetch from "node-fetch";
import { refreshYahooToken } from "./refreshToken.js";

/**
 * Resolve the user's NFL league_key and team_key for a given season.
 * If you know the league name or id, pass it to narrow selection.
 */
export async function resolveSeasonKeys({
  season = "2025",
  leagueNameOrId,
} = {}) {
  const token = await refreshYahooToken();

  // 1) Find NFL game for the season (e.g., 2025)
  const gamesRes = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;seasons=${season}?format=json`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!gamesRes.ok) throw new Error(`games fetch failed ${gamesRes.status}`);
  const gamesJson = await gamesRes.json();
  console.dir(gamesJson, { depth: null });

  const gamesArr =
    gamesJson?.fantasy_content?.users?.[0]?.user?.[1]?.games?.filter(Boolean) ??
    [];
  const nflGame = gamesArr
    .map((g) => g.game?.[0])
    .find((g0) => g0?.code === "nfl");
  const game_key = nflGame?.game_key;
  if (!game_key) throw new Error(`NFL game_key not found for season ${season}`);

  // 2) List leagues for that game
  const leaguesRes = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=${game_key}/leagues?format=json`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!leaguesRes.ok)
    throw new Error(`leagues fetch failed ${leaguesRes.status}`);
  const leaguesJson = await leaguesRes.json();

  const leagues =
    leaguesJson?.fantasy_content?.users?.[0]?.user?.[1]?.games?.[0]?.game?.[1]?.leagues
      ?.map((x) => x.league?.[0])
      ?.filter(Boolean) ?? [];

  let league = leagues[0];
  if (leagueNameOrId) {
    league =
      leagues.find(
        (l) =>
          String(l.league_id) === String(leagueNameOrId) ||
          l.name === leagueNameOrId
      ) || league;
  }
  if (!league) throw new Error("No league found for current season");
  const league_key = league.league_key;

  // 3) Find your team in that league
  const teamsRes = await fetch(
    `https://fantasysports.yahooapis.com/fantasy/v2/league/${league_key}/teams?format=json`,
    {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    }
  );
  if (!teamsRes.ok) throw new Error(`teams fetch failed ${teamsRes.status}`);
  const teamsJson = await teamsRes.json();

  const teams =
    teamsJson?.fantasy_content?.league?.[1]?.teams
      ?.filter((x) => x.team)
      ?.map((x) => x.team?.[0]) ?? [];

  const myTeam =
    teams.find((t) => t?.is_owned_by_current_login === "1") || teams[0];

  if (!myTeam) throw new Error("No team found in league");
  const team_key = myTeam.team_key;

  return { season, game_key, league_key, team_key };
}
