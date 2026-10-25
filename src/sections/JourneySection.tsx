import { motion } from "framer-motion";
import { JOURNEY } from "../data/content";

export function JourneySection() {
  return (
    <section id="journey" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
            {JOURNEY.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{JOURNEY.body}</p>
        </div>

        <div className="mt-16 grid md:grid-cols-[auto_1fr] gap-x-10 gap-y-0">
          {JOURNEY.steps.map((step, i) => (
            <Step key={step.title} index={i} total={JOURNEY.steps.length} title={step.title} detail={step.detail} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-paper-line bg-paper-dim px-8 py-10 text-center md:px-12"
        >
          <p className="font-display text-2xl text-ink">{JOURNEY.prompt}</p>
          <a
            href="#qualifier"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[0.95rem] font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:bg-ink-deep"
          >
            {JOURNEY.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Step({
  index,
  total,
  title,
  detail,
}: {
  index: number;
  total: number;
  title: string;
  detail: string;
}) {
  const isLast = index === total - 1;

  return (
    <>
      <div className="hidden md:flex flex-col items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
          {index + 1}
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-paper-line" style={{ minHeight: "2.5rem" }} />}
      </div>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start gap-4 pb-8 md:pb-10"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper md:hidden">
          {index + 1}
        </div>
        <div>
          <div className="font-display text-xl text-ink">{title}</div>
          <div className="mt-1 text-[0.95rem] text-ink-soft">{detail}</div>
        </div>
      </motion.div>
    </>
  );
}
