import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { ResultVisual } from "../components/ResultVisual";

export function SocialProofSection() {
  const { testimonials } = useCms();
  const items = testimonials.slice(0, 6);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[index];

  return (
    <section id="results" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              Real people, real progress
            </h2>
            <p className="mt-3 max-w-md text-ink-soft">
              Moments shared inside the community — in their own words.
            </p>
          </div>
          <Link
            to="/blog"
            className="text-sm font-medium text-gold-deep underline decoration-paper-line underline-offset-4 transition-colors hover:text-ink"
          >
            See all stories →
          </Link>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-paper-line bg-paper-dim mx-auto md:mx-0">
            <AnimatePresence mode="wait">
              {current.images[0] ? (
                <motion.img
                  key={current.slug}
                  src={current.images[0]}
                  alt={`Result shared by ${current.attributedTo}: ${current.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <ResultVisual tag={current.resultTag ?? current.title} seed={index} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.resultTag && (
                  <span className="inline-flex items-center rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink-deep">
                    {current.resultTag}
                  </span>
                )}
                <p className="mt-4 text-lg leading-relaxed text-ink">&ldquo;{current.excerpt}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-ink-soft">— {current.attributedTo}</p>
                <Link
                  to={`/blog/${current.slug}`}
                  className="mt-5 inline-block text-sm font-medium text-gold-deep hover:text-ink"
                >
                  Read the full story →
                </Link>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <div className="mt-8 flex gap-2">
                {items.map((item, i) => (
                  <button
                    key={item.slug}
                    onClick={() => setIndex(i)}
                    aria-label={`Show story ${i + 1}`}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === index ? "2rem" : "0.9rem",
                      background: i === index ? "var(--color-gold)" : "var(--color-paper-line)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
