// ---------------------------------------------------------------------------
// HOW TO ADD A NEW RESULT
//
// Prefer going through the built-in editor at /admin — it writes entries in
// this exact shape and is the easiest way to add one, then downloads this
// file for you to drop in here, replacing the old copy.
//
// Adding by hand works too: push a new entry to the top of TESTIMONIALS below.
//
// A NOTE ON PRIVACY: payout/chat screenshots forwarded from the community
// often contain other people's full names, phone numbers, emails or partial
// account numbers. Don't paste those in directly — use first name + last
// initial for attribution, and pull out just the figure/quote rather than
// embedding the raw image. The design is built so a clean result card looks
// better than a screenshot anyway.
// ---------------------------------------------------------------------------

export interface Testimonial {
  slug: string; // used in the URL: /blog/<slug> — lowercase, hyphenated, unique
  attributedTo: string; // first name + last initial, e.g. "Grace E."
  date: string; // "YYYY-MM-DD"
  title: string; // short headline for the blog listing/card
  excerpt: string; // 1-2 sentences for the card + meta description
  body: string; // the fuller write-up
  images: string[]; // paths under public/, e.g. "/testimonials/grace.jpg" — leave empty to use the generated result card look
  resultTag?: string; // optional short stat chip, e.g. "₦30,000 payout"
}

export const TESTIMONIALS: Testimonial[] = [
  {
    slug: "graces-first-affiliate-sale",
    attributedTo: "Grace E.",
    date: "2026-10-17",
    title: "Her first affiliate sale, celebrated by the whole group",
    excerpt: "\"Congratulations to me guys, I just made a sale.\" Grace's first commission notification, shared the moment it landed.",
    body: "Congratulations to me guys, I just made a sale.\n\nMy appreciation goes to everyone for always supporting and encouraging us.\n\nThe community's reply came within the minute: \"Congratulations to you dear. Here's to more wins and bigger milestones!\"",
    images: [],
    resultTag: "First sale",
  },
  {
    slug: "prospers-sales-challenge-win",
    attributedTo: "Prosper N.",
    date: "2026-09-16",
    title: "Winner of the Steady Income Sales Challenge",
    excerpt: "A ₦30,000 reward for topping the community's sales challenge — with an invitation to keep going.",
    body: "\"You're the winner of our previous sales challenge. You did well, big congratulations! Let's do more next!\"\n\nReward paid out directly, with the receipt shared in the group as proof.",
    images: [],
    resultTag: "Challenge winner · ₦30,000",
  },
  {
    slug: "ebunoluwas-sales-challenge-reward",
    attributedTo: "Ebunoluwa C.",
    date: "2026-09-14",
    title: "A sales challenge reward, with thanks going right back to the group",
    excerpt: "\"Thank you so much, I really really appreciate.\" A ₦25,000 reward, and a note of gratitude the next morning.",
    body: "Congrats dear — you did well, let's do more next!\n\nThank you so much, I really really appreciate.\n\nGood morning.",
    images: [],
    resultTag: "Challenge reward · ₦25,000",
  },
  {
    slug: "chinwokes-sales-challenge-reward",
    attributedTo: "Chinwoke M.",
    date: "2026-09-14",
    title: "Another sales challenge reward paid out",
    excerpt: "A ₦27,500 reward credited directly for performance in the community's sales challenge.",
    body: "Reward paid out for the Steady Income Sales Challenge — proof shared with the group the same week as two other members' payouts.",
    images: [],
    resultTag: "Challenge reward · ₦27,500",
  },
];

export function getTestimonialBySlug(slug: string) {
  return TESTIMONIALS.find((t) => t.slug === slug);
}
