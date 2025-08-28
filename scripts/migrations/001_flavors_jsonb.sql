alter table teams
  drop column if exists flavor;

alter table teams
  add column if not exists flavors jsonb default '[]'::jsonb;
