import { getTeamsByLeague, getTeamByKey } from "../repos/teamsRepo.js";
import { getRosterForTeam } from "../repos/rostersRepo.js";
// import { getRoastsByWeek } from '../repos/messagesRepo.js';

export async function getStandingsView(leagueId) {
  // Swap this for your real standings table if you have one
  const teams = await getTeamsByLeague(leagueId);
  if (!teams.length) return "No teams yet.";
  return teams.map((t) => `• ${t.name}`).join("\n");
}

export async function getMyTeamRoster(teamKey, week) {
  const team = await getTeamByKey(teamKey);
  if (!team) return "Team not found.";
  const roster = await getRosterForTeam(team.id, week);
  if (!roster.length) {
    return `No roster found${
      Number.isInteger(week) ? ` for week ${week}` : ""
    }.`;
  }
  return roster
    .map((p) => `${p.player_name}${p.position ? ` (${p.position})` : ""}`)
    .join("\n");
}

// export async function getRoastsText(leagueId, week) {
//   const rows = await getRoastsByWeek(leagueId, week);
//   if (!rows.length) return `No roasts saved for week ${week}.`;
//   return rows.map(r => `• ${r.text}`).join('\n');
// }
