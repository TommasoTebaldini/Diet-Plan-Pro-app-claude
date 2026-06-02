-- ── user_achievements ─────────────────────────────────────────────────────────
create table if not exists user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  achievement_key text not null,
  earned_at timestamptz default now(),
  unique(user_id, achievement_key)
);
alter table user_achievements enable row level security;
create policy "user_achievements_own" on user_achievements
  for all using (auth.uid() = user_id);

-- ── weekly_checkins ────────────────────────────────────────────────────────────
create table if not exists weekly_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start_date date not null,
  satisfaction_score int check (satisfaction_score between 1 and 10),
  diet_adherence text check (diet_adherence in ('sempre','spesso','a_volte','raramente','mai')),
  weight_kg numeric(5,2),
  energy int check (energy between 1 and 5),
  sleep_quality int check (sleep_quality between 1 and 5),
  stress int check (stress between 1 and 5),
  difficulties text,
  next_week_goal text,
  message_to_dietitian text,
  submitted_at timestamptz default now(),
  unique(user_id, week_start_date)
);
alter table weekly_checkins enable row level security;
create policy "weekly_checkins_own" on weekly_checkins
  for all using (auth.uid() = user_id);
create policy "weekly_checkins_dietitian_read" on weekly_checkins
  for select using (
    exists (
      select 1 from patient_dietitian
      where patient_dietitian.patient_id = weekly_checkins.user_id
        and patient_dietitian.dietitian_id = auth.uid()
    )
  );
