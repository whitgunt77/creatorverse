alter table creators add column if not exists youtube_url text;
alter table creators add column if not exists instagram_url text;
alter table creators add column if not exists tiktok_url text;
alter table creators add column if not exists twitter_url text;
alter table creators add column if not exists twitch_url text;
alter table creators add column if not exists category text;
alter table creators add column if not exists tags text;
alter table creators add column if not exists favorite boolean not null default false;

alter table creators disable row level security;
