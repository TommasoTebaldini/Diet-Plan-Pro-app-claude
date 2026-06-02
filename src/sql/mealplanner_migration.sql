create table if not exists meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  week_start_date date not null,
  created_at timestamptz default now(),
  unique(user_id, week_start_date)
);
alter table meal_plans enable row level security;
create policy "meal_plans_own" on meal_plans for all using (auth.uid() = user_id);

create table if not exists meal_plan_items (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references meal_plans(id) on delete cascade not null,
  day_of_week int not null check (day_of_week between 0 and 6),
  meal_type text not null,
  food_name text not null,
  food_data jsonb not null default '{}',
  grams numeric not null default 100,
  created_at timestamptz default now()
);
alter table meal_plan_items enable row level security;
create policy "meal_plan_items_own" on meal_plan_items for all
using (
  exists (select 1 from meal_plans where meal_plans.id = meal_plan_items.plan_id and meal_plans.user_id = auth.uid())
);
