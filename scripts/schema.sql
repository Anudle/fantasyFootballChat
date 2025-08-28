-- scripts/schema.sql
create table if not exists teams (
  id serial primary key,
  league_id text not null,
  team_key text unique not null,
  name text not null,
  manager text,                         -- e.g., "Jason"
  city text,
  flavor text,                          -- fun fact/snark seed
  last_roster_synced_at timestamptz     -- for cache TTL
);

create table if not exists roster_players (
  id serial primary key,
  team_id int not null references teams(id) on delete cascade,
  player_key text,                      -- if you later want Yahoo’s player key
  player_name text not null,
  position text,                        -- optional
  unique (team_id, player_name)
);
