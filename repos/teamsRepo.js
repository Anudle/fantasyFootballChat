import { query } from "../db/query.js";

export async function getTeamsByLeague(leagueId) {
  return query(
    `select id, league_id, team_key, name, manager, city, flavor, last_roster_synced_at
     from teams
     where league_id = $1
     order by name asc`,
    [leagueId]
  );
}

export async function getTeamByKey(teamKey) {
  const rows = await query(
    `select id, league_id, team_key, name, manager, city, flavor, last_roster_synced_at
     from teams
     where team_key = $1`,
    [teamKey]
  );
  return rows[0] || null;
}

// handy for "hey bot roast jason"
// repos/teamsRepo.js
export async function getTeamByManagerFirstName(first) {
  const rows = await query(
    `
    SELECT
      id, name, manager,
      team_key, league_key, season,
      flavors,                   -- <- plural
      home_city, home_state, home_country
    FROM teams
    WHERE LOWER(manager) LIKE LOWER($1) || '%'
    LIMIT 1
    `,
    [first]
  );
  return rows[0] || null;
}
export async function touchRosterSync(teamId) {
  await query(
    `UPDATE teams
        SET last_roster_synced_at = NOW()
      WHERE id = $1`,
    [teamId]
  );
}

export async function getAllTeams() {
  return query(
    `SELECT id, name, manager, team_key, league_key, season, last_roster_synced_at
     FROM teams
     ORDER BY id`
  );
}

export async function updateTeamKeys(teamId, { season, team_key, league_key }) {
  const sets = [];
  const params = [teamId];
  let i = 2;

  if (season) {
    sets.push(`season = $${i++}`);
    params.push(season);
  }
  if (team_key) {
    sets.push(`team_key = $${i++}`);
    params.push(team_key);
  }
  if (league_key) {
    sets.push(`league_key = $${i++}`);
    params.push(league_key);
  }

  if (!sets.length) return;

  await query(`UPDATE teams SET ${sets.join(", ")} WHERE id = $1`, params);
}
