-- Custom Dashboards (Insights)
create table public.custom_dashboards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  title text not null default 'New Dashboard',
  widgets jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.custom_dashboards enable row level security;

-- Users can only see/edit custom_dashboards in their own workspaces
create policy "Users own custom_dashboards" on public.custom_dashboards
  for all using (
    workspace_id in (select id from public.workspaces where user_id = auth.uid())
  );
