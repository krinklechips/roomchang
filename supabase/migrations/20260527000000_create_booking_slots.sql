create extension if not exists "pgcrypto";

create table if not exists public.booking_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time time not null,
  duration_minutes integer default 60,
  is_available boolean default true,
  booked_by_name text,
  booked_by_email text,
  booked_by_phone text,
  booked_by_telegram text,
  treatment text,
  branch text,
  doctor text,
  notes text,
  status text check (status in ('available', 'pending', 'confirmed', 'cancelled')) default 'available',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint booking_slots_date_time_unique unique (date, time)
);

create index if not exists booking_slots_date_time_idx
  on public.booking_slots (date, time);

create index if not exists booking_slots_date_is_available_idx
  on public.booking_slots (date, is_available);

create or replace function public.set_booking_slots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_slots_updated_at on public.booking_slots;

create trigger booking_slots_updated_at
  before update on public.booking_slots
  for each row
  execute function public.set_booking_slots_updated_at();

create or replace function public.book_appointment_slot(
  p_name text,
  p_email text,
  p_phone text,
  p_telegram text,
  p_treatment text,
  p_date date,
  p_time time,
  p_branch text,
  p_doctor text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot_id uuid;
  v_is_available boolean;
  v_status text;
begin
  insert into public.booking_slots (date, time, duration_minutes, is_available, status)
  values (p_date, p_time, 60, true, 'available')
  on conflict (date, time) do nothing;

  select id, is_available, status
    into v_slot_id, v_is_available, v_status
  from public.booking_slots
  where date = p_date
    and time = p_time
  for update;

  if v_slot_id is null or v_is_available is not true or v_status <> 'available' then
    raise exception 'slot_not_available';
  end if;

  update public.booking_slots
  set
    is_available = false,
    status = 'pending',
    booked_by_name = nullif(p_name, ''),
    booked_by_email = nullif(p_email, ''),
    booked_by_phone = nullif(p_phone, ''),
    booked_by_telegram = nullif(p_telegram, ''),
    treatment = nullif(p_treatment, ''),
    branch = nullif(p_branch, ''),
    doctor = nullif(p_doctor, ''),
    notes = nullif(p_notes, '')
  where id = v_slot_id;

  return v_slot_id;
end;
$$;
