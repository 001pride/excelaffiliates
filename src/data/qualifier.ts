export type Segment = "cold" | "warm";
export type Tier = "exploring" | "engaged" | "ready";

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  helper?: string;
  options: QuizOption[];
}

export const QUALIFIER_INTRO = {
  eyebrowless_title: "Find your starting point",
  body: "Answer five quick questions. We'll tell you where you currently stand and what a sensible next step looks like — no sales pitch required to see it.",
  cta: "Start the assessment",
  estimate: "Takes about 60 seconds",
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "experience",
    prompt: "What best describes you right now?",
    options: [
      { value: "new", label: "I'm completely new to online income" },
      { value: "tried_few", label: "I've tried a few things, loosely" },
      { value: "tried_affiliate", label: "I've tried affiliate marketing specifically" },
      { value: "selling_online", label: "I'm already selling something online" },
    ],
  },
  {
    id: "goal",
    prompt: "What are you primarily looking for?",
    options: [
      { value: "skill", label: "A marketable skill I can rely on" },
      { value: "extra_income", label: "An additional income stream" },
      { value: "start_affiliate", label: "A real start in affiliate marketing" },
      { value: "improve_existing", label: "To improve something I'm already doing" },
    ],
  },
  {
    id: "challenge",
    prompt: "What's your biggest challenge right now?",
    options: [
      { value: "where_to_start", label: "I don't know where to start" },
      { value: "audience", label: "Finding people / building an audience" },
      { value: "content", label: "Creating content consistently" },
      { value: "sales", label: "Actually making sales" },
      { value: "consistency", label: "Staying consistent, period" },
      { value: "big_picture", label: "Understanding how it all fits together" },
    ],
  },
  {
    id: "invested",
    prompt: "Have you invested in learning an online skill or business before?",
    options: [
      { value: "no", label: "No, not yet" },
      { value: "didnt_work", label: "Yes, but it didn't really work out" },
      { value: "currently", label: "Yes, and I'm currently learning" },
    ],
  },
  {
    id: "nextStep",
    prompt: "What would you like to do next?",
    helper: "There's no wrong answer here — this just tells us how to help.",
    options: [
      { value: "learn_more", label: "I'd like to learn more first" },
      { value: "interested_sigc", label: "I'm interested in the S.I.G.C. opportunity" },
    ],
  },
];

const CHALLENGE_COPY: Record<string, string> = {
  where_to_start: "knowing where to start",
  audience: "finding the right people to reach",
  content: "creating content consistently",
  sales: "turning interest into actual sales",
  consistency: "staying consistent over time",
  big_picture: "seeing how the pieces fit together",
};

const STAGE_COPY: Record<string, string> = {
  new: "Beginner",
  tried_few: "Early explorer",
  tried_affiliate: "Affiliate-curious",
  selling_online: "Already selling",
};

export interface QualifierResult {
  segment: Segment;
  tier: Tier;
  stageLabel: string;
  challengeLabel: string;
  headline: string;
  body: string;
  ctaLabel: string;
  secondary?: { label: string; message: string };
}

// ---------------------------------------------------------------------------
// Readiness is read from the combination of answers, not just the last
// question — someone who's already selling, has invested before, and is
// stuck specifically on sales reads very differently from someone brand new,
// even if both say "I'd like to learn more first." The explicit final
// answer still decides WhatsApp routing (we don't push someone into a sales
// chat they didn't ask for), but it's no longer the only signal used.
// ---------------------------------------------------------------------------
function readinessScore(answers: Record<string, string>): number {
  const experienceScore: Record<string, number> = { new: 0, tried_few: 1, tried_affiliate: 2, selling_online: 2 };
  const investedScore: Record<string, number> = { no: 0, didnt_work: 1, currently: 2 };
  const challengeScore: Record<string, number> = {
    where_to_start: 0,
    big_picture: 0,
    consistency: 0,
    content: 1,
    audience: 1,
    sales: 2,
  };

  return (
    (experienceScore[answers.experience] ?? 0) +
    (investedScore[answers.invested] ?? 0) +
    (challengeScore[answers.challenge] ?? 0)
  );
}

function resolveTier(answers: Record<string, string>): Tier {
  if (answers.nextStep === "interested_sigc") return "ready";
  return readinessScore(answers) >= 4 ? "engaged" : "exploring";
}

export function resolveResult(answers: Record<string, string>): QualifierResult {
  const tier = resolveTier(answers);
  const segment: Segment = tier === "ready" ? "warm" : "cold";
  const stageLabel = STAGE_COPY[answers.experience] ?? "Getting started";
  const challengeLabel = CHALLENGE_COPY[answers.challenge] ?? "getting momentum";

  if (tier === "ready") {
    return {
      segment,
      tier,
      stageLabel,
      challengeLabel,
      headline: `You're interested in exploring S.I.G.C.`,
      body: `Based on what you shared, you're at the "${stageLabel}" stage, and ${challengeLabel} is the real obstacle in front of you. The next step is a short personal conversation so we can understand your situation properly and explain how the system actually works — no scripts, just a real answer to whether it fits.`,
      ctaLabel: "Continue on WhatsApp",
    };
  }

  if (tier === "engaged") {
    return {
      segment,
      tier,
      stageLabel,
      challengeLabel,
      headline: `You're currently at: ${stageLabel}`,
      body: `You've already got some experience, and ${challengeLabel} is what's in the way right now. We'd suggest starting in the community so you can learn alongside people at a similar stage — and if you'd rather skip ahead to a direct conversation about S.I.G.C. instead, that's available too.`,
      ctaLabel: "Join the community",
      secondary: {
        label: "Or talk to us directly instead",
        message: `Hi! I just did the starting-point assessment — I'm at the "${stageLabel}" stage and my main challenge is ${challengeLabel}. I'd like to ask some questions directly.`,
      },
    };
  }

  return {
    segment,
    tier,
    stageLabel,
    challengeLabel,
    headline: `You're currently at: ${stageLabel}`,
    body: `It looks like ${challengeLabel} is the thing standing between you and momentum. Rather than push you toward anything, we'd rather keep helping you understand the fundamentals first — join the community and learn alongside people at a similar stage, then decide for yourself whether S.I.G.C. is worth a closer look.`,
    ctaLabel: "Join the community",
  };
}

export function buildPersonalMessage(result: QualifierResult, answers: Record<string, string>) {
  const goal = QUESTIONS.find((q) => q.id === "goal")?.options.find((o) => o.value === answers.goal)?.label;
  return `Hi! I just completed the "Find Your Starting Point" assessment. Stage: ${result.stageLabel}. Main goal: ${goal ?? "not specified"}. Biggest challenge: ${result.challengeLabel}. I'd like to talk about S.I.G.C.`;
}
