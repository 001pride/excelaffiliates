import { motion } from "framer-motion";
import { FRAMEWORK } from "../data/content";
import { GradientAura } from "../components/GradientAura";

export function FrameworkSection() {
  return (
    <section id="framework" className="relative overflow-hidden bg-ink-deep py-24 text-paper md:py-32">
      <GradientAura variant="dark" />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <div className="max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl leading-tight tracking-tight md:text-4xl"
          >
            {FRAMEWORK.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-lg leading-relaxed text-paper/70"
          >
            {FRAMEWORK.body}
          </motion.p>
        </div>

        <div className="mt-20">
          <Chain />
        </div>
      </div>
    </section>
  );
}

function Chain() {
  const steps = FRAMEWORK.steps;

  return (
    <div className="relative">
      <div className="hidden md:block absolute left-0 right-0 top-[22px] h-px bg-paper/15" />
      <div className="grid gap-10 md:grid-cols-5 md:gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex md:flex-col items-start md:items-start gap-4 md:gap-5"
          >
            <div className="relative shrink-0">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold"
                style={{
                  borderColor: i === steps.length - 1 ? "var(--color-gold)" : "rgba(245,241,228,0.25)",
                  background: i === steps.length - 1 ? "var(--color-gold)" : "var(--color-ink-deep)",
                  color: i === steps.length - 1 ? "var(--color-ink-deep)" : "var(--color-paper)",
                }}
              >
                {i + 1}
              </div>
            </div>
            <div>
              <div className="font-display text-xl">{step.label}</div>
              <div className="mt-1 text-sm text-paper/60">{step.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
