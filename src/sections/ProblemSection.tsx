import { motion } from "framer-motion";
import { PROBLEM } from "../data/content";

export function ProblemSection() {
  return (
    <section className="bg-paper-dim py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
            {PROBLEM.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{PROBLEM.body}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-paper-line bg-paper p-6"
            >
              <h3 className="font-display text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
