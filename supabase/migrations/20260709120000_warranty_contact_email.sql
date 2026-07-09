-- Warranty contact should be just the general email (contact@roomchang.com),
-- not a phone/website. Add an email column and switch the seeded row over.
alter table public.warranty_terms add column if not exists contact_email text;

update public.warranty_terms
set contact_email = 'contact@roomchang.com',
    contact_phone = null,
    contact_website = null;
