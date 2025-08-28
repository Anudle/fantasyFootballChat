-- scripts/migrations/004_team_profile_fields.sql
alter table teams
  add column if not exists home_city text,
  add column if not exists home_state text,
  add column if not exists home_country text;

-- optional: index for quick lookups by manager name
create index if not exists teams_manager_lower_idx on teams (lower(manager));
