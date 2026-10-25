import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ } from "../data/content";
import { useCms } from "../context/CmsContext";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { faq } = useCms();

  return (
    <section id="faq" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">{FAQ.title}</h2>

        <div className="mt-10 divide-y divide-paper-line border-y border-paper-line">
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg text-ink">{item.q}</span>
                  <span
                    className="shrink-0 text-xl text-ink-soft transition-transform"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[0.95rem] leading-relaxed text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
