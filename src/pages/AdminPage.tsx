import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  fetchFaqItems,
  updateSiteSettings,
  upsertFaqItem,
  deleteFaqItem,
  upsertTestimonial,
  deleteTestimonial,
  uploadMedia,
  type FaqItem,
} from "../lib/cms";
import { useCms, type EffectiveSettings, type MergedTestimonial } from "../context/CmsContext";
import { Seo } from "../components/Seo";

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-2xl border border-paper-line bg-paper-dim p-8 text-center">
          <h1 className="font-display text-xl text-ink">Admin isn't set up yet</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            This site isn't connected to Supabase, so there's nothing to sign in to. See{" "}
            <code className="rounded bg-paper px-1 py-0.5">SUPABASE_SETUP.md</code> for how to connect it.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (checkingSession) {
    return <AdminShell>{null}</AdminShell>;
  }

  if (!session) {
    return (
      <AdminShell>
        <LoginForm />
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Dashboard session={session} />
    </AdminShell>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper pb-24 text-ink">
      <Seo title="Admin" description="Content editor" path="/admin" noindex />
      {children}
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-paper-line bg-paper-dim p-8">
        <h1 className="font-display text-xl text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink-soft">
          This is a real account login (Supabase Auth) — not a shared passphrase.
        </p>
        <label className="mt-5 block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            autoFocus
            required
          />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-medium text-ink-soft">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-deep disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <style>{INPUT_STYLE}</style>
      </form>
    </div>
  );
}

type Tab = "settings" | "faq" | "testimonials";

function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("settings");

  async function signOut() {
    await supabase?.auth.signOut();
  }

  return (
    <div>
      <header className="border-b border-paper-line bg-paper-dim px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-ink">Content editor</h1>
            <p className="mt-1 text-xs text-ink-soft">Signed in as {session.user.email}</p>
          </div>
          <button onClick={signOut} className="text-sm font-medium text-ink-soft hover:text-ink">
            Sign out
          </button>
        </div>
        <nav className="mx-auto mt-5 flex max-w-5xl gap-2">
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
            Site settings
          </TabButton>
          <TabButton active={tab === "faq"} onClick={() => setTab("faq")}>
            FAQ
          </TabButton>
          <TabButton active={tab === "testimonials"} onClick={() => setTab("testimonials")}>
            Results / testimonials
          </TabButton>
        </nav>
      </header>

      <div className="mx-auto mt-10 max-w-5xl px-6">
        {tab === "settings" && <SettingsEditor />}
        {tab === "faq" && <FaqEditor />}
        {tab === "testimonials" && <TestimonialsEditor />}
      </div>
      <style>{INPUT_STYLE}</style>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-ink text-paper" : "bg-paper text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Site settings editor
// ---------------------------------------------------------------------------
function SettingsEditor() {
  const { settings, refresh } = useCms();
  const [form, setForm] = useState<EffectiveSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function set<K extends keyof EffectiveSettings>(key: K, value: EffectiveSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function setCategory(i: number, field: "title" | "detail", value: string) {
    const next = form.offerCategories.map((c, idx) => (idx === i ? { ...c, [field]: value } : c));
    set("offerCategories", next);
  }

  async function save() {
    setSaving(true);
    try {
      await updateSiteSettings({
        brand: form.brand,
        tagline: form.tagline,
        contact_email: form.contactEmail,
        hero_headline: form.heroHeadline,
        hero_sub: form.heroSub,
        hero_cta_primary: form.heroCtaPrimary,
        hero_cta_secondary: form.heroCtaSecondary,
        hero_microcopy: form.heroMicrocopy,
        offer_eyebrow: form.offerEyebrow,
        offer_title: form.offerTitle,
        offer_body: form.offerBody,
        offer_categories: form.offerCategories,
        offer_disclaimer: form.offerDisclaimer,
        offer_cta: form.offerCta,
      });
      refresh();
      setSaved(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-paper-line bg-paper-dim p-6">
      <h2 className="font-display text-lg text-ink">Brand &amp; contact</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Brand name">
          <input className="input" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="input" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Contact email">
          <input
            className="input"
            type="email"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
        </Field>
      </div>

      <h2 className="mt-8 font-display text-lg text-ink">Hero section</h2>
      <div className="mt-4 grid gap-3">
        <Field label="Headline">
          <textarea className="input" rows={2} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
        </Field>
        <Field label="Subtext">
          <textarea className="input" rows={2} value={form.heroSub} onChange={(e) => set("heroSub", e.target.value)} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Primary button label">
            <input className="input" value={form.heroCtaPrimary} onChange={(e) => set("heroCtaPrimary", e.target.value)} />
          </Field>
          <Field label="Secondary link label">
            <input className="input" value={form.heroCtaSecondary} onChange={(e) => set("heroCtaSecondary", e.target.value)} />
          </Field>
        </div>
        <Field label="Microcopy (small line under the buttons)">
          <input className="input" value={form.heroMicrocopy} onChange={(e) => set("heroMicrocopy", e.target.value)} />
        </Field>
      </div>

      <h2 className="mt-8 font-display text-lg text-ink">Offer section (S.I.G.C.)</h2>
      <div className="mt-4 grid gap-3">
        <Field label="Eyebrow">
          <input className="input" value={form.offerEyebrow} onChange={(e) => set("offerEyebrow", e.target.value)} />
        </Field>
        <Field label="Title">
          <input className="input" value={form.offerTitle} onChange={(e) => set("offerTitle", e.target.value)} />
        </Field>
        <Field label="Body">
          <textarea className="input" rows={4} value={form.offerBody} onChange={(e) => set("offerBody", e.target.value)} />
        </Field>
        <Field label="Disclaimer (small print under the categories)">
          <textarea className="input" rows={2} value={form.offerDisclaimer} onChange={(e) => set("offerDisclaimer", e.target.value)} />
        </Field>
        <Field label="Button label">
          <input className="input" value={form.offerCta} onChange={(e) => set("offerCta", e.target.value)} />
        </Field>

        <p className="mt-2 text-xs font-medium text-ink-soft">Offer categories</p>
        {form.offerCategories.map((cat, i) => (
          <div key={i} className="rounded-lg border border-paper-line bg-paper p-3">
            <input
              className="input"
              placeholder="Category title"
              value={cat.title}
              onChange={(e) => setCategory(i, "title", e.target.value)}
            />
            <textarea
              className="input mt-2"
              rows={2}
              placeholder="Category detail"
              value={cat.detail}
              onChange={(e) => setCategory(i, "detail", e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-deep disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && <span className="text-sm text-ink-soft">Saved ✓</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ editor
// ---------------------------------------------------------------------------
function FaqEditor() {
  const { faq, refresh } = useCms();
  const [draft, setDraft] = useState({ question: "", answer: "" });
  const [savingId, setSavingId] = useState<string | null>(null);

  // faq here is the merged { q, a } shape without ids (static fallback has none),
  // so once Supabase is configured and seeded, every item does carry an id —
  // re-fetch raw items directly when we need to edit/delete by id.
  const [rawItems, setRawItems] = useState<FaqItem[]>([]);
  useEffect(() => {
    fetchFaqItems().then((items) => setRawItems(items ?? []));
  }, [faq]);

  async function addItem() {
    if (!draft.question.trim() || !draft.answer.trim()) return;
    setSavingId("new");
    try {
      await upsertFaqItem({ question: draft.question, answer: draft.answer, sort_order: rawItems.length });
      setDraft({ question: "", answer: "" });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateItem(item: FaqItem, patch: Partial<FaqItem>) {
    setSavingId(item.id);
    try {
      await upsertFaqItem({ ...item, ...patch });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSavingId(null);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Delete this question?")) return;
    setSavingId(id);
    try {
      await deleteFaqItem(id);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-paper-line bg-paper-dim p-6">
        <h2 className="font-display text-lg text-ink">Add a question</h2>
        <div className="mt-4 grid gap-3">
          <Field label="Question">
            <input
              className="input"
              value={draft.question}
              onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
            />
          </Field>
          <Field label="Answer">
            <textarea
              className="input"
              rows={4}
              value={draft.answer}
              onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
            />
          </Field>
        </div>
        <button
          onClick={addItem}
          disabled={savingId === "new"}
          className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-deep disabled:opacity-60"
        >
          Add question
        </button>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink">
          Current questions <span className="text-ink-soft/60">({rawItems.length})</span>
        </h2>
        <div className="mt-4 space-y-3">
          {rawItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-paper-line bg-paper p-4">
              <input
                className="input"
                value={item.question}
                onChange={(e) => setRawItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, question: e.target.value } : i)))}
                onBlur={(e) => updateItem(item, { question: e.target.value })}
              />
              <textarea
                className="input mt-2"
                rows={3}
                value={item.answer}
                onChange={(e) => setRawItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, answer: e.target.value } : i)))}
                onBlur={(e) => updateItem(item, { answer: e.target.value })}
              />
              <button
                onClick={() => removeItem(item.id)}
                disabled={savingId === item.id}
                className="mt-2 text-sm font-medium text-ink-soft/70 hover:text-ink"
              >
                Delete
              </button>
            </div>
          ))}
          {rawItems.length === 0 && <p className="text-sm text-ink-soft">No FAQ items yet.</p>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Testimonials editor
// ---------------------------------------------------------------------------
const EMPTY_TESTIMONIAL: MergedTestimonial = {
  slug: "",
  attributedTo: "",
  date: new Date().toISOString().slice(0, 10),
  title: "",
  excerpt: "",
  body: "",
  images: [],
  resultTag: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TestimonialsEditor() {
  const { testimonials, refresh } = useCms();
  const [draft, setDraft] = useState<MergedTestimonial>(EMPTY_TESTIMONIAL);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function startNew() {
    setDraft({ ...EMPTY_TESTIMONIAL, date: new Date().toISOString().slice(0, 10) });
    setEditingSlug(null);
  }

  function startEdit(item: MergedTestimonial) {
    setDraft(item);
    setEditingSlug(item.slug);
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      setDraft((d) => ({ ...d, images: [url] }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!draft.title.trim() || !draft.attributedTo.trim()) {
      alert("Title and attribution (first name + initial) are required.");
      return;
    }
    const slug = draft.slug.trim() || slugify(draft.title);
    setSaving(true);
    try {
      await upsertTestimonial({
        slug,
        attributed_to: draft.attributedTo,
        date: draft.date,
        title: draft.title,
        excerpt: draft.excerpt,
        body: draft.body,
        image_url: draft.images[0] ?? null,
        result_tag: draft.resultTag || null,
      });
      refresh();
      startNew();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: MergedTestimonial) {
    if (!item.id) {
      alert("This is a built-in default item, not stored in the database — nothing to delete.");
      return;
    }
    if (!confirm("Delete this result?")) return;
    try {
      await deleteTestimonial(item.id);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-paper-line bg-paper-dim p-6">
        <h2 className="font-display text-lg text-ink">{editingSlug ? "Edit result" : "Add a new result"}</h2>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Use a first name plus last initial only (e.g. "Grace E."), never a full name. Prefer leaving the image
          empty — it'll show a generated card instead of a raw screenshot, which keeps other people's details out of
          what you publish.
        </p>

        <div className="mt-4 grid gap-3">
          <Field label="Title">
            <input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Attributed to (first name + initial)">
            <input
              className="input"
              value={draft.attributedTo}
              onChange={(e) => setDraft({ ...draft, attributedTo: e.target.value })}
              placeholder="Grace E."
            />
          </Field>
          <Field label="Date">
            <input type="date" className="input" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </Field>
          <Field label="Result tag (short stat chip, optional)">
            <input
              className="input"
              value={draft.resultTag ?? ""}
              onChange={(e) => setDraft({ ...draft, resultTag: e.target.value })}
              placeholder="₦30,000 payout"
            />
          </Field>
          <Field label="Excerpt (quote or 1-2 sentences)">
            <textarea className="input" rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          </Field>
          <Field label="Full write-up">
            <textarea className="input" rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          </Field>
          <Field label="Image (optional — uploads to storage)">
            <input type="file" accept="image/*" onChange={onPickImage} className="text-sm" disabled={uploading} />
            {uploading && <p className="mt-1 text-xs text-ink-soft">Uploading…</p>}
            {draft.images[0] && (
              <div className="mt-2 flex items-center gap-2">
                <img src={draft.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
                <button onClick={() => setDraft((d) => ({ ...d, images: [] }))} className="text-xs text-ink-soft/70 hover:text-ink">
                  remove
                </button>
              </div>
            )}
          </Field>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-deep disabled:opacity-60"
          >
            {editingSlug ? "Save changes" : "Add result"}
          </button>
          {editingSlug && (
            <button onClick={startNew} className="text-sm font-medium text-ink-soft hover:text-ink">
              Cancel edit
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink">
          Current results <span className="text-ink-soft/60">({testimonials.length})</span>
        </h2>
        <div className="mt-4 space-y-3">
          {testimonials.map((item) => (
            <div key={item.slug} className="flex items-start justify-between gap-4 rounded-xl border border-paper-line bg-paper p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {item.attributedTo} · {item.date}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 text-sm">
                <button onClick={() => startEdit(item)} className="font-medium text-gold-deep hover:text-ink">
                  Edit
                </button>
                <button onClick={() => remove(item)} className="font-medium text-ink-soft/70 hover:text-ink">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="text-sm text-ink-soft">No results yet — add one on the left.</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

const INPUT_STYLE = `
  .input {
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid var(--color-paper-line);
    background: var(--color-paper);
    padding: 0.6rem 0.9rem;
    color: var(--color-ink);
    outline: none;
    font-size: 0.9rem;
  }
  .input:focus {
    border-color: var(--color-gold);
  }
`;
