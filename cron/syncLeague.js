import fetch from 'node-fetch';
import { pool } from '../data/db.js';
import { refreshYahooToken } from '../yahoo/refreshToken.js';

const leagueKey = '449.l.438606';
const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`;

async function run() {
  const accessToken = await refreshYahooToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Yahoo HTTP ${res.status} – ${body}`);
  }

  const json = await res.json();

  await pool.query(
    `INSERT INTO league_snapshots (league_key, payload) VALUES ($1, $2)`,
    [leagueKey, json]
  );

  console.log('✅ Snapshot saved at', new Date().toISOString());
}

run()
  .then(() => pool.end())
  .catch(err => {
    console.error('❌ Sync failed:', err.message);
    process.exit(1);
  });
