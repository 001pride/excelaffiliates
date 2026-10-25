import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS, QUALIFIER_INTRO, resolveResult, buildPersonalMessage } from "../data/qualifier";
import { CircularProgress } from "../components/CircularProgress";
import { GradientAura } from "../components/GradientAura";
import { personalChatLink, communityGroupLink } from "../lib/whatsapp";

type Stage = "intro" | "question" | "result";

export function Qualifier() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  function selectOption(value: string) {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setStage("result");
    }
  }

  function goBack() {
    if (index === 0) {
      setStage("intro");
    } else {
      setIndex(index - 1);
    }
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setStage("intro");
  }

  return (
    <section id="qualifier" className="bg-paper-dim py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-paper-line bg-paper px-6 py-10 shadow-soft md:px-12 md:py-14">
          <GradientAura variant="panel" />
          <AnimatePresence mode="wait" initial={false}>
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold">
                  <RingIcon />
                </div>
                <h2 className="font-display text-3xl text-ink md:text-4xl">Find your starting point</h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">{QUALIFIER_INTRO.body}</p>
                <button
                  onClick={() => setStage("question")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-[0.95rem] font-semibold text-ink-deep transition-transform hover:-translate-y-0.5 hover:bg-gold-deep"
                >
                  {QUALIFIER_INTRO.cta}
                </button>
                <p className="mt-4 text-sm text-ink-soft/70">{QUALIFIER_INTRO.estimate}</p>
              </motion.div>
            )}

            {stage === "question" && (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    aria-label="Go back"
                  >
                    ← Back
                  </button>
                  <CircularProgress value={index + 1} total={total} />
                </div>

                <h3 className="mt-8 font-display text-2xl leading-snug text-ink md:text-[1.7rem]">
                  {question.prompt}
                </h3>
                {question.helper && <p className="mt-2 text-sm text-ink-soft">{question.helper}</p>}

                <div className="mt-7 grid gap-3">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(opt.value)}
                      className="group flex items-center justify-between rounded-xl border border-paper-line bg-paper px-5 py-4 text-left text-[0.98rem] text-ink transition-colors hover:border-gold hover:bg-gold-soft/20"
                    >
                      <span>{opt.label}</span>
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-paper-line transition-colors group-hover:border-gold group-hover:bg-gold" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === "result" && (
              <ResultView key="result" answers={answers} onRestart={restart} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ResultView({
  answers,
  onRestart,
}: {
  answers: Record<string, string>;
  onRestart: () => void;
}) {
  const result = resolveResult(answers);
  const isWarm = result.segment === "warm";
  const href = isWarm ? personalChatLink(buildPersonalMessage(result, answers)) : communityGroupLink();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div
        className="mx-auto mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
        style={{
          background: isWarm ? "var(--color-gold-soft)" : "var(--color-moss-soft)",
          color: "var(--color-ink-deep)",
        }}
      >
        {result.stageLabel}
      </div>
      <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">{result.headline}</h2>
      <p className="mx-auto mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">{result.body}</p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-[0.95rem] font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:bg-ink-deep"
      >
        <WhatsAppMark />
        {result.ctaLabel}
      </a>

      {result.secondary && (
        <a
          href={personalChatLink(result.secondary.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-sm font-medium text-gold-deep hover:text-ink"
        >
          {result.secondary.label} →
        </a>
      )}

      <div>
        <button
          onClick={onRestart}
          className="mt-6 block w-full text-center text-sm font-medium text-ink-soft/70 transition-colors hover:text-ink-soft"
        >
          Retake the assessment
        </button>
      </div>
    </motion.div>
  );
}

function RingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="8" stroke="var(--color-gold-deep)" strokeWidth="1.6" />
      <circle cx="11" cy="11" r="2.5" fill="var(--color-gold-deep)" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a9.96 9.96 0 0 0 4.9 1.28h.01c5.52 0 10-4.48 10-10s-4.49-9.93-10.01-9.93Zm0 18.13h-.01a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.05.8.82-2.98-.2-.3a8.26 8.26 0 0 1-1.28-4.4c0-4.56 3.72-8.28 8.28-8.28 2.21 0 4.29.86 5.85 2.42a8.2 8.2 0 0 1 2.42 5.86c0 4.56-3.73 8.22-8.29 8.22Zm4.54-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
