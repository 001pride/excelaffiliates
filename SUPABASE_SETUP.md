# Supabase setup (CMS + admin login)

This site's content (site settings, FAQ, testimonials/results) and the
`/admin` editor are backed by Supabase. This file is the one-time setup —
do these three things once, in order.

Project already in use for this site: `https://nxzrrknrucljdphzdxnf.supabase.co`

## 1. Run the schema

1. Open the Supabase dashboard → your project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/schema.sql` from this repo.
3. Click **Run**.

This creates three tables (`site_settings`, `faq_items`, `testimonials`), a
public `media` storage bucket for admin-uploaded images, Row Level Security
policies (anyone can read; only a signed-in user can write), and seeds the
tables with the current site copy so the admin panel isn't empty on first
load.

It's safe to re-run this file at any time — every statement uses
`if not exists` / `on conflict` guards, so running it again won't duplicate
data or overwrite anything you've already edited from `/admin`.

## 2. Create your admin login

The schema above sets up the *data*, but Supabase Auth (who's allowed to
sign in to `/admin`) is managed separately, and on purpose: nothing in this
codebase — frontend or SQL — has the privilege to create a user account for
you. That's a deliberate security boundary, not a missing step.

1. Supabase dashboard → **Authentication** → **Users** → **Add user**.
2. Enter your email and a password. Choose **Auto Confirm User** (or
   confirm via the emailed link) so you can sign in immediately.
3. Go to `https://excelaffiliates.vercel.app/admin` (or `/admin` on
   whatever URL the site is running on) and sign in with that email and
   password.

Create exactly one admin account for yourself. Anyone who's signed in can
edit everything, so don't create accounts for people you don't want editing
the live site. There's no self-serve signup page — `/admin` only has a
login form, and Supabase Auth has no public "sign up" open to visitors.

## 3. Set the environment variables

The frontend needs two values to talk to Supabase. Both are safe to expose
publicly — they're the project URL and the "publishable" (anon) key, not
the secret service-role key. Security comes from the Row Level Security
policies set up in step 1, not from hiding these.

**Locally** (already done in this repo): `.env.local`

```
VITE_SUPABASE_URL=https://nxzrrknrucljdphzdxnf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Bd3BzfDOd5vVNMKXPTwXaA_fv5HWJr1
```

**On Vercel** (required for the live site — `.env.local` never gets
deployed):

1. Vercel dashboard → this project → **Settings** → **Environment
   Variables**.
2. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same
   values as above, for the **Production** environment (and Preview, if you
   want preview deployments to show live content too).
3. Redeploy — Vite bakes env vars in at build time, so a new deploy is
   needed after adding or changing them.

If these aren't set, the site still works — it just falls back to the
built-in default copy in `src/data/content.ts` / `src/data/testimonials.ts`
instead of what's in the database, and `/admin` will say it isn't set up.

## What never goes in the frontend

The Supabase **service-role key** (shown in Project Settings → API,
separate from the anon/publishable key) must never be used in this
codebase, committed, or put in a `VITE_*` variable — those all ship to
every visitor's browser. It isn't needed for anything here: reads are
public by RLS policy, and writes are gated by a signed-in user's session,
not by that key. If you ever see a setup guide telling you to put the
service-role key in frontend code, don't.
