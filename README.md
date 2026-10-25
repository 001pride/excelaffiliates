# Excelaffiliates — Find Your Starting Point

Excelaffiliates is an independent affiliate-marketing business. This site is
its lead-qualification funnel: hero → problem → framework → offer (S.I.G.C.)
→ who it's for → journey → social proof → qualifier → FAQ → about → contact
→ footer, plus a `/blog` of community results and a real, database-backed
`/admin` content editor.

**Brand note, important:** Excelaffiliates is its own business, not S.I.G.C.
S.I.G.C. (The Smart Income Circle) is the training/community system
currently presented and recommended through Excelaffiliates — the site
owner is an affiliate and community member, not S.I.G.C.'s creator or
operator. This distinction is baked into the copy throughout `src/data/`
and the legal pages; keep it that way if you edit further.

Built with React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, React
Router, and Supabase (database + auth + storage) for the CMS.

## Before you launch — fill these in

**1. Supabase (the CMS backend)** — see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).
That's the one real setup step: run the schema, create your one admin
login, set the two `VITE_*` env vars. Everything else below is optional
polish.

**2. WhatsApp routing** — the numbers are stored in Supabase `site_settings`
(editable from `/admin`) with a static fallback in `src/lib/whatsapp.ts` for
when Supabase isn't configured. Update either as needed:

```ts
personalNumber: "2376XXXXXXXX",      // WhatsApp number, international format, digits only
communityGroupUrl: "https://chat.whatsapp.com/YOUR_INVITE_CODE",
```

Every path for an interested visitor goes through a personal WhatsApp chat
first — there's intentionally no direct link anywhere to an external S.I.G.C.
checkout/sales page. Keep it that way unless that decision changes.

**3. Domain** — `SITE_URL` in `src/components/Seo.tsx`, and the matching
entries in `public/sitemap.xml` and `public/robots.txt`, are already set to
`https://excelaffiliates.vercel.app`. If you add a custom domain later,
update all three to match.

## The CMS — editing content without touching code

Go to `/admin` on the running site and sign in with the account you created
in Supabase (see `SUPABASE_SETUP.md` — there's no passphrase, no shared
login, it's a real account). Three tabs:

- **Site settings** — brand name, tagline, contact email, hero copy, and the
  offer/S.I.G.C. section copy and categories.
- **FAQ** — add, edit, or delete questions.
- **Results / testimonials** — add, edit, or delete community results shown
  on the homepage carousel and `/blog`. Images you pick here upload directly
  to Supabase Storage.

**Important — read before adding a result from a forwarded screenshot:**
- Payout receipts and chat screenshots from the community often show other
  people's full names, phone numbers, emails, or partial account numbers.
  **Use first name + last initial** for attribution (the editor's label says
  this too), and pull out just the quote or figure rather than uploading the
  raw receipt image.
- If you leave the image field empty, the site automatically generates a
  clean, on-brand result card instead — this looks better than a screenshot
  anyway and sidesteps the privacy issue entirely. That's what the seeded
  entries use.
- Keep attribution honest: these are named as other people's results
  because that's what they are. Don't remove or obscure whose result is
  whose.

If Supabase isn't configured (or is unreachable), the site falls back to
the built-in static copy in `src/data/content.ts` and
`src/data/testimonials.ts` — it won't break, it just won't reflect any
`/admin` edits until the connection is restored.

## Where things live

- `src/data/content.ts` — static fallback copy (brand, hero, offer, FAQ,
  footer) — used when Supabase has no row yet, or a field is empty
- `src/data/testimonials.ts` — static fallback results
- `src/data/qualifier.ts` — the qualifier questions, weighted multi-answer
  scoring, and the three readiness tiers (exploring / engaged / ready) each
  with their own result message and routing
- `src/lib/whatsapp.ts` — WhatsApp numbers/links (static fallback;
  overridden by `site_settings` once Supabase loads)
- `src/lib/supabase.ts` — the Supabase client
- `src/lib/cms.ts` — typed reads/writes against the three CMS tables + media
  upload
- `src/context/CmsContext.tsx` — `useCms()` hook; merges live Supabase data
  over the static fallback, used by every content-bearing component
- `supabase/schema.sql` — the full database schema, RLS policies, and seed
  data — see `SUPABASE_SETUP.md`
- `src/components/` — Nav, Hero, Footer, Seo, GradientAura (decorative
  backgrounds), ResultVisual (generated testimonial card art)
- `src/sections/` — ProblemSection, FrameworkSection, OfferSection,
  JourneySection, AboutSection, SocialProofSection, FaqSection,
  ContactSection, Qualifier
- `src/pages/` — HomePage, BlogListPage, BlogPostPage, AdminPage, and
  `pages/legal/` (Privacy, Terms, Affiliate Disclosure)

To change a qualifier question, edit `QUESTIONS` in `qualifier.ts`. Scoring
and tier thresholds live in `readinessScore()` / `resolveTier()` in the same
file — it weighs all the answers given, not just the last one.

## SEO — what's done, and the one honest limitation

Done: per-page titles/descriptions, Open Graph + Twitter card tags, JSON-LD
structured data (Organization/WebSite on the homepage, Article on each blog
post, CollectionPage on `/blog`), a sitemap, a robots.txt that excludes
`/admin`, semantic heading structure, and descriptive alt text throughout.

**The limitation:** this is a client-side React single-page app. That's the
right call for the animated, app-like feel of the funnel, but it's
genuinely the weakest starting point for organic search — a crawler that
doesn't execute JavaScript sees very little in the raw HTML. Everything
above is still worth having and costs nothing to keep. But if organic
Google traffic becomes a real goal (rather than traffic from your own
content/social links, which this handles fine), the actual fix is migrating
to WordPress or adding static pre-rendering. More keywords in a SPA won't
close that gap; a different rendering approach will.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

To view it on your phone while it's running: `npm run dev -- --host` on the
same Wi-Fi, or a tunnel like `npx localtunnel --port 5173` from anywhere.

## Deploy to Vercel (free tier)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), sign in, and import that repo.
3. Vercel auto-detects Vite — leave the defaults (build command
   `npm run build`, output directory `dist`) and click **Deploy**.
4. In Project → Settings → Environment Variables, add `VITE_SUPABASE_URL`
   and `VITE_SUPABASE_ANON_KEY` (same values as your `.env.local`) — see
   `SUPABASE_SETUP.md`. Redeploy after adding them.
5. Add a custom domain later under Project → Settings → Domains if you get
   one — and remember to update `SITE_URL` and the sitemap/robots files when
   you do.

Or from your machine with the Vercel CLI:

```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # subsequent production deploys
```

Every push to your GitHub repo's main branch will auto-redeploy once it's
connected. Content edits made from `/admin` go live immediately (no
redeploy needed) since they're read from Supabase at page load.
