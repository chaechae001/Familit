-- =====================================================================
-- Familit (패밀릿) MVP — Supabase / PostgreSQL 스키마
-- 가족 케어 앱: 캘린더가 아니라 "가족 케어 업무"를 관리하는 데이터 구조
-- 실행 위치: Supabase 대시보드 > SQL Editor > New query > 전체 붙여넣기 > Run
-- =====================================================================

-- =========================================
-- 0. Extension
-- =========================================
create extension if not exists "uuid-ossp";

-- =========================================
-- 1. ENUM 타입
-- =========================================
create type digital_literacy_level as enum ('low', 'medium', 'high');

create type care_category as enum (
  'health_checkup', 'diet_care', 'telecom', 'insurance',
  'utility_bill', 'family_event', 'gift', 'travel',
  'household_task', 'family_meeting', 'custom'
);

create type card_priority as enum ('low', 'medium', 'high', 'urgent');
create type card_status   as enum ('todo', 'doing', 'done', 'postponed');
create type repeat_type   as enum ('none', 'weekly', 'monthly', 'yearly', 'custom');
create type card_source   as enum ('manual', 'ai_generated', 'routine');
create type ai_rec_type   as enum ('routine', 'card', 'diet');
create type share_channel as enum ('web_share', 'copy');

-- =========================================
-- 2. 공통 함수: updated_at 자동 갱신
-- =========================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================
-- 3. 테이블
-- =========================================

-- 3-1. users (Supabase auth.users 확장)
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3-2. family_groups (가족 그룹)
create table public.family_groups (
  id            uuid primary key default uuid_generate_v4(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3-3. family_members (가족 구성원 프로필)
-- 주의: 건강 관련 필드는 "생활 관리 메모" 수준. 진단/처방/검사결과 파일 업로드 없음.
create table public.family_members (
  id                     uuid primary key default uuid_generate_v4(),
  family_group_id        uuid not null references public.family_groups(id) on delete cascade,
  name                   text not null,
  relation               text,
  birth_date             date,
  age                    int,
  location               text,
  phone                  text,
  digital_literacy_level digital_literacy_level default 'medium',
  health_notes           text,   -- 생활 관리 메모
  chronic_conditions     text,   -- 생활 관리 메모
  diet_notes             text,   -- 생활 관리 메모
  medication_notes       text,   -- 생활 관리 메모
  checkup_cycle_months   int,
  telecom_provider       text,
  telecom_plan_memo      text,
  insurance_memo         text,
  utility_payment_memo   text,
  care_priority          card_priority default 'medium',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- 3-4. care_cards (케어 카드 — 패밀릿의 핵심 데이터)
create table public.care_cards (
  id               uuid primary key default uuid_generate_v4(),
  family_group_id  uuid not null references public.family_groups(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete set null,
  owner_user_id    uuid references public.users(id) on delete set null,
  title            text not null,
  description      text,
  category         care_category not null default 'custom',
  priority         card_priority not null default 'medium',
  status           card_status   not null default 'todo',
  due_date         date,
  repeat_type      repeat_type   not null default 'none',
  suggested_action text,
  memo             text,
  source           card_source   not null default 'manual',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  completed_at     timestamptz
);

-- 3-5. care_routines (반복 케어 루틴 — AI 추천 포함)
create table public.care_routines (
  id                uuid primary key default uuid_generate_v4(),
  family_group_id   uuid not null references public.family_groups(id) on delete cascade,
  family_member_id  uuid references public.family_members(id) on delete set null,
  title             text not null,
  category          care_category not null default 'custom',
  repeat_rule       text,   -- 예: 'WEEKLY:SUN', 'MONTHLY:25', 'YEARLY:birthday-21d'
  next_due_date     date,
  default_checklist jsonb not null default '[]'::jsonb,
  is_active         boolean not null default true,
  created_by_ai     boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 3-6. care_checklists (카드별 체크리스트 항목)
create table public.care_checklists (
  id           uuid primary key default uuid_generate_v4(),
  care_card_id uuid not null references public.care_cards(id) on delete cascade,
  content      text not null,
  is_done      boolean not null default false,
  order_index  int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 3-7. care_logs (완료된 케어 기록 — retention 핵심)
create table public.care_logs (
  id               uuid primary key default uuid_generate_v4(),
  family_group_id  uuid not null references public.family_groups(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete set null,
  care_card_id     uuid references public.care_cards(id) on delete set null,
  category         care_category,
  title            text not null,
  completed_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3-8. ai_recommendations (AI 추천 결과 저장)
create table public.ai_recommendations (
  id               uuid primary key default uuid_generate_v4(),
  family_group_id  uuid not null references public.family_groups(id) on delete cascade,
  family_member_id uuid references public.family_members(id) on delete set null,
  type             ai_rec_type not null,
  input_text       text,
  result           jsonb not null default '{}'::jsonb,
  is_accepted      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3-9. share_logs (공유 기록)
create table public.share_logs (
  id              uuid primary key default uuid_generate_v4(),
  family_group_id uuid not null references public.family_groups(id) on delete cascade,
  owner_user_id   uuid references public.users(id) on delete set null,
  content         text not null,
  channel         share_channel not null default 'copy',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =========================================
-- 4. 인덱스
-- =========================================
create index idx_family_members_group   on public.family_members(family_group_id);
create index idx_care_cards_group        on public.care_cards(family_group_id);
create index idx_care_cards_member       on public.care_cards(family_member_id);
create index idx_care_cards_status_due   on public.care_cards(status, due_date);
create index idx_care_checklists_card    on public.care_checklists(care_card_id);
create index idx_care_routines_group     on public.care_routines(family_group_id);
create index idx_care_routines_due       on public.care_routines(next_due_date) where is_active;
create index idx_care_logs_group         on public.care_logs(family_group_id);
create index idx_care_logs_member        on public.care_logs(family_member_id);
create index idx_ai_rec_group            on public.ai_recommendations(family_group_id);
create index idx_share_logs_group        on public.share_logs(family_group_id);

-- =========================================
-- 5. updated_at 트리거
-- =========================================
create trigger trg_users_updated         before update on public.users              for each row execute function public.set_updated_at();
create trigger trg_groups_updated         before update on public.family_groups      for each row execute function public.set_updated_at();
create trigger trg_members_updated        before update on public.family_members     for each row execute function public.set_updated_at();
create trigger trg_cards_updated          before update on public.care_cards         for each row execute function public.set_updated_at();
create trigger trg_routines_updated       before update on public.care_routines      for each row execute function public.set_updated_at();
create trigger trg_checklists_updated     before update on public.care_checklists    for each row execute function public.set_updated_at();
create trigger trg_logs_updated           before update on public.care_logs          for each row execute function public.set_updated_at();
create trigger trg_ai_rec_updated         before update on public.ai_recommendations for each row execute function public.set_updated_at();
create trigger trg_share_logs_updated     before update on public.share_logs         for each row execute function public.set_updated_at();

-- =========================================
-- 6. 신규 가입 시 public.users 자동 생성
-- =========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', '사용자'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- 7. RLS (Row Level Security)
-- MVP 원칙: 데이터는 "가족 그룹 소유자(=가입한 자녀 본인)"에게만 보임.
-- 가족 초대/공유 기능은 동의 절차와 함께 추후 확장.
-- =========================================

-- 그룹 소유 여부 헬퍼
create or replace function public.owns_family_group(gid uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists(
    select 1 from public.family_groups g
    where g.id = gid and g.owner_user_id = auth.uid()
  );
$$;

-- users
alter table public.users enable row level security;
create policy "users_self" on public.users
  for all using (id = auth.uid()) with check (id = auth.uid());

-- family_groups
alter table public.family_groups enable row level security;
create policy "groups_own" on public.family_groups
  for all using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- family_members
alter table public.family_members enable row level security;
create policy "members_in_own_group" on public.family_members
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- care_cards
alter table public.care_cards enable row level security;
create policy "cards_in_own_group" on public.care_cards
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- care_routines
alter table public.care_routines enable row level security;
create policy "routines_in_own_group" on public.care_routines
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- care_checklists (부모 카드의 그룹 기준)
alter table public.care_checklists enable row level security;
create policy "checklists_via_card" on public.care_checklists
  for all using (
    exists (select 1 from public.care_cards c
            where c.id = care_card_id
              and public.owns_family_group(c.family_group_id))
  )
  with check (
    exists (select 1 from public.care_cards c
            where c.id = care_card_id
              and public.owns_family_group(c.family_group_id))
  );

-- care_logs
alter table public.care_logs enable row level security;
create policy "logs_in_own_group" on public.care_logs
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- ai_recommendations
alter table public.ai_recommendations enable row level security;
create policy "ai_rec_in_own_group" on public.ai_recommendations
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- share_logs
alter table public.share_logs enable row level security;
create policy "share_logs_in_own_group" on public.share_logs
  for all using (public.owns_family_group(family_group_id))
  with check (public.owns_family_group(family_group_id));

-- =====================================================================
-- 끝. 데이터 삭제(개인정보) 기능은 family_groups 삭제 시
-- on delete cascade 로 하위 데이터가 모두 정리되도록 설계됨.
-- =====================================================================
