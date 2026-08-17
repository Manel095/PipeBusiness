-- Add steps to processes
alter table public.processes 
add column if not exists steps jsonb default '[]'::jsonb;

-- Add schema mapping to connections
alter table public.connections
add column if not exists schema_mapping jsonb default '{}'::jsonb;

-- Create entities table to track actual objects (Clients, Projects, Tasks)
create table public.entities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  process_id uuid references public.processes(id) on delete set null,
  type text not null, -- 'client', 'project', 'task'
  name text not null,
  status text default 'active',
  properties jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- RLS for entities
alter table public.entities enable row level security;
create policy "Users own entities" on public.entities
  for all using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Create relations between entities (e.g. Project belongs to Client)
create table public.entity_relations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  parent_id uuid references public.entities(id) on delete cascade,
  child_id uuid references public.entities(id) on delete cascade,
  relation_type text default 'parent_child',
  created_at timestamptz default now(),
  unique(parent_id, child_id)
);

-- RLS for entity_relations
alter table public.entity_relations enable row level security;
create policy "Users own entity_relations" on public.entity_relations
  for all using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );
