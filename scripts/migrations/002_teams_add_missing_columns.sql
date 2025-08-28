-- Add any missing columns used by the seed
alter table teams
  add column if not exists league_id text,
  add column if not exists manager text,
  add column if not exists city text,
  add column if not exists last_roster_synced_at timestamptz,
  add column if not exists team_key text;

-- Ensure team_key is unique (if not already)
create unique index if not exists teams_team_key_key on teams(team_key);

