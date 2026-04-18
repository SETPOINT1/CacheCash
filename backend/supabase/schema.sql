create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  name text not null,
  owner_id uuid not null,
  owner_name text not null,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  member_count integer not null default 1 check (member_count >= 1),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  total_amount numeric(12, 2) not null check (total_amount > 0),
  allocated_amount numeric(12, 2) not null check (allocated_amount >= 0),
  committed_amount numeric(12, 2) not null default 0 check (committed_amount >= 0),
  currency text not null default 'THB',
  alerts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.expense_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  requester_id uuid null,
  requester_name text not null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'THB',
  category text not null,
  description text not null,
  vendor_name text null,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
  price_signal text not null default 'PASS' check (price_signal in ('PASS', 'WARNING', 'BLOCK')),
  policy_signal text not null default 'PASS' check (policy_signal in ('PASS', 'WARNING', 'BLOCK')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.approval_steps (
  id uuid primary key default gen_random_uuid(),
  expense_note_id uuid not null references public.expense_notes(id) on delete cascade,
  approver_id uuid null,
  approver_name text not null,
  level integer not null check (level >= 1),
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED')),
  comment text null,
  decided_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_projects_organization_id on public.projects (organization_id);
create index if not exists idx_budgets_project_id on public.budgets (project_id);
create index if not exists idx_expense_notes_project_id on public.expense_notes (project_id);
create index if not exists idx_expense_notes_status on public.expense_notes (status);
create index if not exists idx_approval_steps_expense_note_id on public.approval_steps (expense_note_id);
create index if not exists idx_approval_steps_status on public.approval_steps (status);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_budgets_updated_at on public.budgets;
create trigger trg_budgets_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

drop trigger if exists trg_expense_notes_updated_at on public.expense_notes;
create trigger trg_expense_notes_updated_at
before update on public.expense_notes
for each row execute function public.set_updated_at();

drop trigger if exists trg_approval_steps_updated_at on public.approval_steps;
create trigger trg_approval_steps_updated_at
before update on public.approval_steps
for each row execute function public.set_updated_at();
