import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSiteSettings, fetchFaqItems, fetchTestimonials, type SiteSettings, type FaqItem, type CmsTestimonial } from "../lib/cms";
import { setWhatsappConfig } from "../lib/whatsapp";
import { SITE, HERO, OFFER, FAQ } from "../data/content";
import { TESTIMONIALS as STATIC_TESTIMONIALS } from "../data/testimonials";

// The merged shape every component actually reads from. Falls back field-by-
// field to the static defaults in src/data/content.ts, so a half-empty or
// not-yet-configured Supabase project never breaks the page — it just shows
// the built-in copy until someone edits it from /admin.
export interface EffectiveSettings {
  brand: string;
  tagline: string;
  contactEmail: string;
  heroHeadline: string;
  heroSub: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroMicrocopy: string;
  offerEyebrow: string;
  offerTitle: string;
  offerBody: string;
  offerCategories: { title: string; detail: string }[];
  offerDisclaimer: string;
  offerCta: string;
}

function mergeSettings(row: SiteSettings | null): EffectiveSettings {
  return {
    brand: row?.brand || SITE.brand,
    tagline: row?.tagline || SITE.tagline,
    contactEmail: row?.contact_email || SITE.contact.email,
    heroHeadline: row?.hero_headline || HERO.headline,
    heroSub: row?.hero_sub || HERO.sub,
    heroCtaPrimary: row?.hero_cta_primary || HERO.ctaPrimary,
    heroCtaSecondary: row?.hero_cta_secondary || HERO.ctaSecondary,
    heroMicrocopy: row?.hero_microcopy || HERO.microcopy,
    offerEyebrow: row?.offer_eyebrow || OFFER.eyebrow,
    offerTitle: row?.offer_title || OFFER.title,
    offerBody: row?.offer_body || OFFER.body,
    offerCategories: row?.offer_categories?.length ? row.offer_categories : OFFER.categories,
    offerDisclaimer: row?.offer_disclaimer || OFFER.disclaimer,
    offerCta: row?.offer_cta || OFFER.cta,
  };
}

function mergeFaq(items: FaqItem[] | null): { q: string; a: string }[] {
  if (!items || items.length === 0) return FAQ.items;
  return items.map((i) => ({ q: i.question, a: i.answer }));
}

export interface MergedTestimonial {
  id?: string; // only present for rows that came from Supabase, not the static fallback
  slug: string;
  attributedTo: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  images: string[];
  resultTag?: string;
}

function mergeTestimonials(items: CmsTestimonial[] | null): MergedTestimonial[] {
  if (!items || items.length === 0) return STATIC_TESTIMONIALS;
  return items.map((t) => ({
    id: t.id,
    slug: t.slug,
    attributedTo: t.attributed_to,
    date: t.date,
    title: t.title,
    excerpt: t.excerpt,
    body: t.body,
    images: t.image_url ? [t.image_url] : [],
    resultTag: t.result_tag ?? undefined,
  }));
}

interface CmsValue {
  settings: EffectiveSettings;
  faq: { q: string; a: string }[];
  testimonials: MergedTestimonial[];
  loading: boolean;
  refresh: () => void;
}

const CmsContext = createContext<CmsValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [rawSettings, setRawSettings] = useState<SiteSettings | null>(null);
  const [rawFaq, setRawFaq] = useState<FaqItem[] | null>(null);
  const [rawTestimonials, setRawTestimonials] = useState<CmsTestimonial[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchSiteSettings(), fetchFaqItems(), fetchTestimonials()]).then(([s, f, t]) => {
      if (cancelled) return;
      setRawSettings(s);
      setRawFaq(f);
      setRawTestimonials(t);
      if (s) setWhatsappConfig({ personalNumber: s.whatsapp_personal_number, communityGroupUrl: s.whatsapp_group_url });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const value: CmsValue = {
    settings: mergeSettings(rawSettings),
    faq: mergeFaq(rawFaq),
    testimonials: mergeTestimonials(rawTestimonials),
    loading,
    refresh: () => setTick((n) => n + 1),
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsValue {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms() must be used inside <CmsProvider>");
  return ctx;
}
