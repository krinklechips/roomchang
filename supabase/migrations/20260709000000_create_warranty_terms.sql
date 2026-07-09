-- Dental Services Warranty Terms — single-doc content for /pricing/warranty.
-- Editable by the clinic without a redeploy. Read by src/lib/data.ts:getWarrantyTerms().
create extension if not exists "pgcrypto";

create table if not exists public.warranty_terms (
  id uuid primary key default gen_random_uuid(),
  intro text,
  coverage_rows jsonb not null default '[]'::jsonb,          -- [{treatment, coverage, period}]
  covered jsonb not null default '[]'::jsonb,                -- string[]
  not_covered jsonb not null default '[]'::jsonb,            -- string[]
  validity_conditions jsonb not null default '[]'::jsonb,    -- string[]
  validity_note text,
  post_warranty_intro text,
  post_warranty_benefit text,
  post_warranty_terms jsonb not null default '[]'::jsonb,    -- string[]
  limitation_of_liability text,
  non_transferability text,
  clinical_assessment text,
  contact_website text,
  contact_phone text,
  discrepancy_note text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.warranty_terms enable row level security;

create policy "Public can read published warranty"
  on public.warranty_terms for select
  to public
  using (published = true);

create policy "Service role full access to warranty"
  on public.warranty_terms for all
  to service_role
  using (true)
  with check (true);

-- Seed: initial warranty terms (English). Idempotent — only seeds when empty.
insert into public.warranty_terms (
  intro, coverage_rows, covered, not_covered, validity_conditions, validity_note,
  post_warranty_intro, post_warranty_benefit, post_warranty_terms,
  limitation_of_liability, non_transferability, clinical_assessment,
  contact_website, contact_phone, discrepancy_note, published
)
select
  'At Roomchang Dental Hospital, we are committed to delivering high-quality dental treatment using advanced technology, premium materials, and experienced dental professionals. To provide additional peace of mind, selected dental treatments are covered under our Dental Services Warranty Program, subject to the terms and conditions below.',
  '[
    {"treatment":"Dental Implant","coverage":"Implant Fixture & Abutment","period":"5 Years"},
    {"treatment":"Crown & Bridges","coverage":"Zirconia / E-max Restorations","period":"2 Years"},
    {"treatment":"Veneers","coverage":"Porcelain Veneers","period":"1 Year"},
    {"treatment":"Composite Restorations","coverage":"Composite Fillings & Bonding","period":"1 Year"}
  ]'::jsonb,
  '[
    "Defects in workmanship related to restorative or implant treatment.",
    "Failure of crowns, bridges, veneers, composite restorations, or implant restorations due to material or manufacturing defects.",
    "Implant fixture failure resulting from loss of osseointegration or treatment-related factors, as determined by clinical and radiographic evaluation.",
    "Loosening of implant components or abutment screws caused by workmanship or material defects.",
    "Fracture, debonding, or failure of composite restorations resulting from material or workmanship defects.",
    "Necessary repair, replacement, or adjustment of covered restorations when approved by Roomchang Dental Hospital."
  ]'::jsonb,
  '[
    "Requests for cash refunds or financial reimbursement.",
    "Treatment that has been modified, repaired, or adjusted by another dentist or healthcare provider.",
    "Damage resulting from trauma, accidents, sports injuries, or external forces.",
    "Failure caused by smoking, tobacco use, poor oral hygiene, or non-compliance with professional instructions.",
    "Teeth grinding (bruxism) where a protective night guard was recommended but not used.",
    "Failure to attend recommended maintenance and review appointments.",
    "Natural changes in surrounding teeth, gums, or bone structure.",
    "Cosmetic concerns that do not affect the function or integrity of the restoration.",
    "Normal wear and tear over time."
  ]'::jsonb,
  '[
    "Attend routine dental examinations and maintenance visits every 6–12 months.",
    "Follow all post-treatment care instructions provided by the treating dentist.",
    "Maintain good oral hygiene practices.",
    "Inform Roomchang Dental Hospital promptly if any issue or complication arises.",
    "Present evidence of routine dental maintenance if receiving care outside Roomchang Dental Hospital."
  ]'::jsonb,
  'Failure to meet these conditions may result in the warranty becoming void.',
  'Even after the warranty period has expired, Roomchang Dental Hospital remains committed to supporting our patients.',
  'Patients who have complied with all Warranty Validation Conditions and maintained regular dental check-ups may be eligible for a 20% discount on professional fees for the repair or replacement of the same restoration after the warranty period has expired.',
  '[
    "The 20% discount applies only to professional treatment fees.",
    "The discount does not apply to laboratory fees, implant components, restorative materials, medications, radiographs, or other third-party costs.",
    "Eligibility is subject to clinical evaluation and approval by Roomchang Dental Hospital.",
    "The discount applies only to the original patient and the original treatment provided by Roomchang Dental Hospital.",
    "Patients must have attended recommended maintenance visits every 6–12 months to remain eligible.",
    "This benefit is non-transferable and cannot be exchanged for cash or combined with other promotions.",
    "Roomchang Dental Hospital reserves the right to modify or discontinue this benefit without prior notice."
  ]'::jsonb,
  'Roomchang Dental Hospital''s responsibility under this warranty is limited to the repair, replacement, or adjustment of covered treatment. No cash compensation, consequential damages, travel expenses, accommodation costs, loss of income, or indirect expenses shall be covered.',
  'This warranty applies only to the original patient who received treatment and is not transferable to any other individual.',
  'All warranty claims are subject to examination and approval by Roomchang Dental Hospital. The Hospital reserves the right to determine whether the condition qualifies for warranty coverage based on clinical findings, radiographic evidence, and professional judgment.',
  'www.roomchang.com',
  '+855 23 99 6666',
  'In the event of any discrepancy between language versions, the English version shall prevail.',
  true
where not exists (select 1 from public.warranty_terms);
