-- Word of the Day — database setup.
-- Paste this whole file into Supabase → SQL Editor → New query, then click "Run".
-- It's safe to run more than once.

-- People in the group.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_key text not null unique,          -- lowercase name, so "Sam" and "sam" can't both exist
  created_at timestamptz not null default now()
);

-- One word per person per day.
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  day date not null,                      -- the Toronto calendar day it belongs to
  word text not null,                     -- normalized: trimmed + lowercase
  embedding real[],                       -- meaning vector (384 numbers), saved at post time
  mood real,                              -- -1 (negative) … +1 (positive)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);
create index if not exists posts_day_idx on posts (day);
create index if not exists posts_word_idx on posts (word);

-- Emoji reactions: each person can add each emoji once per post.
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id, emoji)
);

-- Short comments.
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 200),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on comments (post_id);

-- Lock the tables so only our server (which uses the secret key) can read or write them.
-- With row level security on and no policies, the public key can't touch anything.
alter table users enable row level security;
alter table posts enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;
