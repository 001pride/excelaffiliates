// ---------------------------------------------------------------------------
// Defaults, used until (and unless) the CMS loads an override from Supabase.
// personalNumber: international format, digits only (no +, spaces or dashes)
//   e.g. Cameroon mobile +237 6XX XXX XXX -> "2376XXXXXXXX"
// communityGroupUrl: the invite link for your S.I.G.C. WhatsApp community/group
//
// These are intentionally a plain mutable object rather than React state:
// CmsProvider calls setWhatsappConfig() once after fetching site_settings,
// and every consumer (Footer, Qualifier, OfferSection, ContactSection) reads
// WHATSAPP_CONFIG at render time, picking up the override because the
// CmsProvider's own state change re-renders the tree beneath it. If this
// grows beyond two fields, move it into CmsContext properly instead.
// ---------------------------------------------------------------------------
export const WHATSAPP_CONFIG = {
  personalNumber: "237687137591",
  communityGroupUrl: "https://chat.whatsapp.com/Cd7NUqiomOBB5PCuSyYEoo",
};

export function setWhatsappConfig(overrides: Partial<typeof WHATSAPP_CONFIG>) {
  if (overrides.personalNumber) WHATSAPP_CONFIG.personalNumber = overrides.personalNumber;
  if (overrides.communityGroupUrl) WHATSAPP_CONFIG.communityGroupUrl = overrides.communityGroupUrl;
}

export function personalChatLink(prefilledMessage: string) {
  const text = encodeURIComponent(prefilledMessage);
  return `https://wa.me/${WHATSAPP_CONFIG.personalNumber}?text=${text}`;
}

export function communityGroupLink() {
  return WHATSAPP_CONFIG.communityGroupUrl;
}
