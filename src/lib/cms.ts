import { supabase, isSupabaseConfigured } from "./supabase";

export interface OfferCategory {
  title: string;
  detail: string;
}

export interface SiteSettings {
  id: number;
  brand: string;
  tagline: string;
  contact_email: string;
  whatsapp_personal_number: string;
  whatsapp_group_url: string;
  hero_headline: string;
  hero_sub: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_microcopy: string;
  offer_eyebrow: string;
  offer_title: string;
  offer_body: string;
  offer_categories: OfferCategory[];
  offer_disclaimer: string;
  offer_cta: string;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface CmsTestimonial {
  id: string;
  slug: string;
  attributed_to: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  result_tag: string | null;
  sort_order: number;
}

// Every function here returns null (not throws) on failure or when Supabase
// isn't configured, so callers can fall back to the static defaults in
// src/data/ without a try/catch at every call site.

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return data as SiteSettings;
}

export async function fetchFaqItems(): Promise<FaqItem[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("faq_items").select("*").order("sort_order", { ascending: true });
  if (error) return null;
  return data as FaqItem[];
}

export async function fetchTestimonials(): Promise<CmsTestimonial[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("date", { ascending: false });
  if (error) return null;
  return data as CmsTestimonial[];
}

export async function fetchTestimonialBySlug(slug: string): Promise<CmsTestimonial | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("testimonials").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return data as CmsTestimonial;
}

// --- Admin writes (require an authenticated Supabase session; RLS enforces this server-side) ---

export async function updateSiteSettings(patch: Partial<SiteSettings>) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const { error } = await supabase.from("site_settings").update(patch).eq("id", 1);
  if (error) throw error;
}

export async function upsertFaqItem(item: Partial<FaqItem> & { question: string; answer: string }) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const { error } = await supabase.from("faq_items").upsert(item);
  if (error) throw error;
}

export async function deleteFaqItem(id: string) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw error;
}

export async function upsertTestimonial(item: Partial<CmsTestimonial> & { slug: string }) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const { error } = await supabase.from("testimonials").upsert(item, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteTestimonial(id: string) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadMedia(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase isn't configured.");
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

export { isSupabaseConfigured };
