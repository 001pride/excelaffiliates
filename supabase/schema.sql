-- ---------------------------------------------------------------------------
-- Excelaffiliates CMS schema.
--
-- HOW TO RUN THIS:
-- Supabase Dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run: every statement uses IF NOT EXISTS / ON CONFLICT so running
-- it twice won't error or duplicate anything.
--
-- WHAT THIS SETS UP:
--   - site_settings: one row holding editable brand/hero/offer/contact copy
--   - faq_items: the FAQ list
--   - testimonials: the community results shown on the homepage and /blog
--   - a public "media" storage bucket for images uploaded from /admin
--   - Row Level Security: anyone can READ (the public site needs this to
--     render), but only a signed-in user can WRITE (that's what makes
--     /admin actually secure — not the page being hard to find).
-- ---------------------------------------------------------------------------

-- 1. Site settings (singleton row, id is always 1)
create table if not exists site_settings (
  id int primary key default 1,
  brand text not null default 'Excelaffiliates',
  tagline text not null default 'Learn. Earn. Grow.',
  contact_email text not null default 'hello@excelaffiliates.example',
  whatsapp_personal_number text not null default '237687137591',
  whatsapp_group_url text not null default '',
  hero_headline text not null default 'Build an online income system, not another link to chase.',
  hero_sub text not null default '',
  hero_cta_primary text not null default 'Find your starting point',
  hero_cta_secondary text not null default 'Explore the S.I.G.C. System',
  hero_microcopy text not null default 'Free to start. No card, no catch.',
  offer_eyebrow text not null default 'The current system we recommend',
  offer_title text not null default 'S.I.G.C. — The Smart Income Circle',
  offer_body text not null default '',
  offer_categories jsonb not null default '[]'::jsonb,
  offer_disclaimer text not null default '',
  offer_cta text not null default 'Ask about S.I.G.C.',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Safety net for a database where an earlier version of this schema already
-- ran: adds the column without touching existing rows.
alter table site_settings add column if not exists hero_microcopy text not null default 'Free to start. No card, no catch.';

insert into site_settings (
  id, brand, tagline, contact_email, whatsapp_personal_number, whatsapp_group_url,
  hero_headline, hero_sub, hero_cta_primary, hero_cta_secondary, hero_microcopy,
  offer_eyebrow, offer_title, offer_body, offer_categories, offer_disclaimer, offer_cta
) values (
  1, 'Excelaffiliates', 'Learn. Earn. Grow.', 'alxndrthepride@gmail.com', '237687137591', 'https://chat.whatsapp.com/Cd7NUqiomOBB5PCuSyYEoo',
  'Build an online income system, not another link to chase.',
  'Excelaffiliates helps you understand digital marketing, affiliate marketing, useful content, trust-building and lead generation — and how they combine into a real system. S.I.G.C. is the training and community we currently recommend for putting it into practice.',
  'Find your starting point', 'Explore the S.I.G.C. System', 'Free to start. No card, no catch.',
  'The current system we recommend', 'S.I.G.C. — The Smart Income Circle',
  'S.I.G.C. is a training, resource and community system built to help people develop real affiliate-marketing skills and implement the systems needed to build a business — not a single download or a quick-fix PDF. Excelaffiliates is an independent business; we''re affiliates and members of the S.I.G.C. community ourselves, presenting a system we use and believe in.',
  '[
    {"title": "Training and learning", "detail": "Instructional video lessons, affiliate-marketing education and practical, hands-on tutorials."},
    {"title": "Marketing implementation", "detail": "Social-media marketing systems, content and promotional guidance, and insights into advertising on major platforms."},
    {"title": "Sales and communication", "detail": "Sales-closing scripts, messaging resources, and guidance on follow-up and automation."},
    {"title": "Tools and resources", "detail": "Templates, autoresponse resources and other materials provided as part of the system."},
    {"title": "Guidance and community", "detail": "Personal direction plus access to a community of active affiliate marketers to ask questions and get support as you go."}
  ]'::jsonb,
  'This reflects how the system has been described to us. We update this page as we confirm specifics — if you want the complete, current details (inclusions, access and terms), the fastest way is to ask directly.',
  'Ask about S.I.G.C.'
) on conflict (id) do nothing;

-- 2. FAQ items
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Testimonials / community results
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  attributed_to text not null,
  date date not null default current_date,
  title text not null,
  excerpt text not null,
  body text not null,
  image_url text,
  result_tag text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Storage bucket for admin-uploaded images
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 5. Row Level Security
alter table site_settings enable row level security;
alter table faq_items enable row level security;
alter table testimonials enable row level security;

drop policy if exists "public can read site_settings" on site_settings;
create policy "public can read site_settings" on site_settings for select using (true);
drop policy if exists "authenticated can update site_settings" on site_settings;
create policy "authenticated can update site_settings" on site_settings for update using (auth.role() = 'authenticated');

drop policy if exists "public can read faq_items" on faq_items;
create policy "public can read faq_items" on faq_items for select using (true);
drop policy if exists "authenticated can write faq_items" on faq_items;
create policy "authenticated can write faq_items" on faq_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public can read testimonials" on testimonials;
create policy "public can read testimonials" on testimonials for select using (true);
drop policy if exists "authenticated can write testimonials" on testimonials;
create policy "authenticated can write testimonials" on testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage policies for the "media" bucket
drop policy if exists "public can read media" on storage.objects;
create policy "public can read media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "authenticated can upload media" on storage.objects;
create policy "authenticated can upload media" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "authenticated can update media" on storage.objects;
create policy "authenticated can update media" on storage.objects for update using (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "authenticated can delete media" on storage.objects;
create policy "authenticated can delete media" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- 6. Seed the initial FAQ + testimonial content so the site has real content
--    immediately, rather than an empty admin panel. Safe to edit/delete from
--    /admin afterwards — this only runs if the tables are empty.
insert into faq_items (question, answer, sort_order)
select * from (values
  ('What is Excelaffiliates?', 'Excelaffiliates is an independent affiliate-marketing business. We create educational content about digital and affiliate marketing, and we currently recommend and present the S.I.G.C. system to people who want structured training and support.', 0),
  ('What is S.I.G.C.?', 'S.I.G.C. (The Smart Income Circle) is a training, resource and community system focused on affiliate marketing — covering instructional content, marketing implementation, sales and communication, practical tools, and guidance from an active community.', 1),
  ('Is Excelaffiliates the same thing as S.I.G.C.?', 'No. Excelaffiliates is our own independent business. S.I.G.C. is the system we currently present and recommend through it — we''re affiliates and community members, not the owners or official operators of S.I.G.C.', 2),
  ('Do I need prior affiliate-marketing experience?', 'No — the system is built to take beginners through the fundamentals, while still being useful to people with some experience who want a more structured approach.', 3),
  ('Does joining guarantee income?', 'No program can honestly guarantee that, and we won''t claim otherwise. Outcomes depend on your own implementation, the skills you build, and circumstances outside anyone''s control.', 4),
  ('How can I ask questions before deciding anything?', 'Message us directly on WhatsApp — no pressure, no obligation. We''d rather you ask the awkward questions up front than find out later.', 5),
  ('How do I proceed if I''m interested?', 'Take the short starting-point assessment below, or message us on WhatsApp directly. Either way, the next step is a real conversation, not an automatic checkout.', 6)
) as seed(question, answer, sort_order)
where not exists (select 1 from faq_items);

insert into testimonials (slug, attributed_to, date, title, excerpt, body, result_tag, sort_order)
select * from (values
  ('graces-first-affiliate-sale', 'Grace E.', date '2026-10-17', 'Her first affiliate sale, celebrated by the whole group', '"Congratulations to me guys, I just made a sale." Grace''s first commission notification, shared the moment it landed.', E'Congratulations to me guys, I just made a sale.\n\nMy appreciation goes to everyone for always supporting and encouraging us.\n\nThe community''s reply came within the minute: "Congratulations to you dear. Here''s to more wins and bigger milestones!"', 'First sale', 0),
  ('prospers-sales-challenge-win', 'Prosper N.', date '2026-09-16', 'Winner of the Steady Income Sales Challenge', 'A ₦30,000 reward for topping the community''s sales challenge — with an invitation to keep going.', E'"You''re the winner of our previous sales challenge. You did well, big congratulations! Let''s do more next!"\n\nReward paid out directly, with the receipt shared in the group as proof.', 'Challenge winner · ₦30,000', 1),
  ('ebunoluwas-sales-challenge-reward', 'Ebunoluwa C.', date '2026-09-14', 'A sales challenge reward, with thanks going right back to the group', '"Thank you so much, I really really appreciate." A ₦25,000 reward, and a note of gratitude the next morning.', E'Congrats dear — you did well, let''s do more next!\n\nThank you so much, I really really appreciate.\n\nGood morning.', 'Challenge reward · ₦25,000', 2),
  ('chinwokes-sales-challenge-reward', 'Chinwoke M.', date '2026-09-14', 'Another sales challenge reward paid out', 'A ₦27,500 reward credited directly for performance in the community''s sales challenge.', 'Reward paid out for the Steady Income Sales Challenge — proof shared with the group the same week as two other members'' payouts.', 'Challenge reward · ₦27,500', 3)
) as seed(slug, attributed_to, date, title, excerpt, body, result_tag, sort_order)
where not exists (select 1 from testimonials);
