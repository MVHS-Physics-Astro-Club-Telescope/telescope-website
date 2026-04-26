-- Migration: 001_interested_users
-- Captures email signups from /observe, /request, and the homepage Public
-- Observatory section. Email + source is unique so we don't double-count
-- a user who signs up from both pages.

create table if not exists interested_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null check (source in ('observe', 'request', 'home')),
  created_at timestamptz default now(),
  ip_hash text
);

create index if not exists interested_users_email_idx
  on interested_users (email);

create unique index if not exists interested_users_email_source_uniq
  on interested_users (email, source);
