import fetch from 'node-fetch';
import { pool } from '../db/pool.js';
import { refreshYahooToken } from '../yahoo/refreshToken.js';

const leagueKey = '449.l.438606';
const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`;

async function run() {
  const accessToken = await refreshYahooToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Yahoo HTTP ${res.status} – ${body}`);
  }

  const json = await res.json();

  // 1) keep a raw snapshot (nice for debugging)
  await pool.query(
    `INSERT INTO public.league_snapshots (league_key, payload) VALUES ($1, $2)`,
    [leagueKey, json]
  );

  // 2) materialize into teams (what your reads query)
  const leagueId = Number(leagueKey.split('.').pop());
  const teamsArr =
    json?.fantasy_content?.league?.teams?.team ??
    json?.fantasy_content?.league?.teams?.[0]?.team ??
    [];

  for (const t of teamsArr) {
    const teamKey = t?.team_key || t?.[0]?.team_key;
    const name = t?.name || t?.[0]?.name || t?.team_name;
    const manager =
      t?.managers?.[0]?.nickname ||
      t?.managers?.manager?.nickname ||
      null;

    if (!teamKey || !name) continue;

    await pool.query(
      `INSERT INTO public.teams (league_id, team_key, name, manager, city)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (team_key) DO UPDATE
         SET league_id = EXCLUDED.league_id,
             name = EXCLUDED.name,
             manager = EXCLUDED.manager,
             city = COALESCE(EXCLUDED.city, public.teams.city)`,
      [leagueId, teamKey, name, null, null]
    );
  }

  console.log('✅ Snapshot + teams upserted at', new Date().toISOString());
}

run()
  .then(() => pool.end())
  .catch(err => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  });
