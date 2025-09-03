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


export async function updateTeamKeys(id, { season, team_key, league_key }) {
  // swap-safe setter to avoid unique violations on team_key (NOT NULL + UNIQUE)
  // Pattern: if someone else owns team_key, move them to a placeholder, then set ours.
  const placeholder = `placeholder:${id}:${Date.now()}`;

  await query("BEGIN");

  try {
    // Who (if anyone) currently owns this team_key?
    const { rows } = await query(
      "SELECT id FROM teams WHERE team_key = $1 FOR UPDATE",
      [team_key]
    );

    if (rows.length && rows[0].id !== id) {
      const otherId = rows[0].id;
      // Free the key from the other row using a guaranteed-unique placeholder
      await query(
        "UPDATE teams SET team_key = $1 WHERE id = $2",
        [placeholder, otherId]
      );
    }

    // Now safely set keys on our target row
    await query(
      `UPDATE teams
         SET season = $2,
             team_key = $3,
             league_key = $4
       WHERE id = $1`,
      [id, season, team_key, league_key]
    );

    await query("COMMIT");
  } catch (e) {
    await query("ROLLBACK");
    // rethrow so your backfill logs the failure neatly
    throw e;
  }
}
