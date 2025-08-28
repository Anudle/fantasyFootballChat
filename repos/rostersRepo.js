import { query } from "../db/query.js";

export async function getRosterForTeamId(teamId) {
  return query(
    `select player_name, player_key, position
     from roster_players
     where team_id = $1
     order by position nulls last, player_name`,
    [teamId]
  );
}

export async function replaceRoster(teamId, players) {
  // keep only non-empty strings and de-dupe
  const clean = Array.from(
    new Set((players || []).filter((p) => typeof p === "string" && p.trim()))
  );

  // wipe old cache
  await query(`delete from roster_players where team_id = $1`, [teamId]);

  // no players? just update timestamp and return
  if (clean.length === 0) {
    await query(
      `update teams set last_roster_synced_at = now() where id = $1`,
      [teamId]
    );
    return [];
  }

  // build VALUES list safely
  const valuesSql = clean.map((_, i) => `($1, $${i + 2})`).join(", ");
  await query(
    `insert into roster_players (team_id, player_name) values ${valuesSql}
     on conflict do nothing`,
    [teamId, ...clean]
  );

  await query(`update teams set last_roster_synced_at = now() where id = $1`, [
    teamId,
  ]);
  return clean;
}
