// services/buildRoastContext.js
import { getTeamByManagerFirstName } from "../repos/teamsRepo.js";
import { getRosterForTeamId } from "../repos/rostersRepo.js";
import { fetchAndSaveRosterForTeam } from "../yahoo/fetchAndSaveRoster.js";

export async function buildRoastContext({ managerFirstName }) {
  const team = await getTeamByManagerFirstName(managerFirstName);
  if (!team) return null;

  // try cached roster; if empty, attempt fetch once
  let players = (await getRosterForTeamId(team.id)).map(r => r.player_name);
  if (!players.length) {
    try { players = await fetchAndSaveRosterForTeam(team); } catch (_) {}
  }

  const homeBits = [team.home_city, team.home_state, team.home_country].filter(Boolean).join(", ");

  return {
    team,
    teamKey: team.team_key,
    teamName: team.name,
    manager: team.manager,
    flavors: team.flavors || [],
    homeLocation: homeBits,
    roster: players,
  };
}
