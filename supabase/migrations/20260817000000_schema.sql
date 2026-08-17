-- Users profile (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

-- Workspaces
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null default 'My Workspace',
  created_at timestamptz default now()
);

-- Processes (nodes on the canvas)
create table public.processes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  icon text default '⚙️',
  description text default '',
  position_x float default 0,
  position_y float default 0,
  color text default '#FF0083',
  status text default 'active',
  created_at timestamptz default now()
);

-- Connections between processes
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  from_process uuid references public.processes(id) on delete cascade,
  to_process uuid references public.processes(id) on delete cascade,
  label text,
  created_at timestamptz default now()
);

-- Data sources per process
create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  process_id uuid references public.processes(id) on delete cascade,
  type text not null, -- webhook, csv, manual, api, google-sheets, zapier, n8n
  name text not null,
  config jsonb default '{}',
  created_at timestamptz default now()
);

-- Ingested data rows
create table public.ingested_data (
  id uuid primary key default gen_random_uuid(),
  process_id uuid references public.processes(id) on delete cascade,
  data_source_id uuid references public.data_sources(id) on delete set null,
  row_data jsonb not null,
  ingested_at timestamptz default now()
);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan text not null, -- free, pro, business
  status text default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.processes enable row level security;
alter table public.connections enable row level security;
alter table public.data_sources enable row level security;
alter table public.ingested_data enable row level security;
alter table public.subscriptions enable row level security;

-- Users can only see/edit their own profile
create policy "Users own profiles" on public.profiles
  for all using (auth.uid() = id);

-- Users can only see/edit their own workspaces
create policy "Users own workspaces" on public.workspaces
  for all using (auth.uid() = user_id);

-- Processes
create policy "Users own processes" on public.processes
  for all using (
    workspace_id in (select id from public.workspaces where user_id = auth.uid())
  );

-- Connections
create policy "Users own connections" on public.connections
  for all using (
    workspace_id in (select id from public.workspaces where user_id = auth.uid())
  );

-- Data Sources
create policy "Users own data_sources" on public.data_sources
  for all using (
    process_id in (
      select p.id from public.processes p
      join public.workspaces w on p.workspace_id = w.id
      where w.user_id = auth.uid()
    )
  );

-- Ingested Data
create policy "Users own ingested_data" on public.ingested_data
  for all using (
    process_id in (
      select p.id from public.processes p
      join public.workspaces w on p.workspace_id = w.id
      where w.user_id = auth.uid()
    )
  );

-- Subscriptions
create policy "Users own subscriptions" on public.subscriptions
  for all using (auth.uid() = user_id);

-- Triggers to automatically create profile and workspace on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_workspace_id uuid;
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

  insert into public.workspaces (user_id, name)
  values (new.id, 'My Workspace')
  returning id into new_workspace_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
