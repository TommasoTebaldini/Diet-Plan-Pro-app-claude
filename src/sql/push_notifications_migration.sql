-- ── push_subscriptions ────────────────────────────────────────────────────────
create table if not exists push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  endpoint text not null,
  p256dh text,
  auth text,
  updated_at timestamptz default now(),
  unique(user_id)
);
alter table push_subscriptions enable row level security;
create policy "push_subscriptions_own" on push_subscriptions
  for all using (auth.uid() = user_id);

-- Service role can read all subscriptions (for server-side push sending)
-- This policy is used by the /api/send-push Vercel function with SUPABASE_SERVICE_ROLE_KEY
create policy "push_subscriptions_service_read" on push_subscriptions
  for select using (true); -- service_role bypasses RLS anyway
