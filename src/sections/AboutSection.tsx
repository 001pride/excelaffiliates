import { motion } from "framer-motion";
import { SITE } from "../data/content";

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-paper-dim py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-xs"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ clipPath: "url(#blobMask)" }}>
              <img
                src="/about/founder.jpg"
                alt={`The person behind ${SITE.brand}`}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 15%" }}
              />
            </div>
            <svg width="0" height="0" aria-hidden>
              <clipPath id="blobMask" clipPathUnits="objectBoundingBox">
                <path d="M0.14,0.09 C0.34,-0.03 0.72,-0.02 0.88,0.14 C1.03,0.29 1.02,0.63 0.91,0.82 C0.8,1.0 0.52,1.05 0.3,0.97 C0.08,0.89 -0.04,0.65 0.02,0.43 C0.06,0.29 0.02,0.19 0.14,0.09 Z" />
              </clipPath>
            </svg>
            <div
              className="absolute -z-10 -top-6 -right-6 h-full w-full opacity-40 blur-2xl"
              style={{ background: "radial-gradient(circle, var(--color-gold-soft) 0%, transparent 70%)" }}
              aria-hidden
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
              An independent affiliate marketer, not a guru.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {SITE.brand} is run by an independent affiliate marketer and member of the S.I.G.C. community —
              not its creator or official representative. This site exists to teach what digital and affiliate
              marketing actually involve, honestly, and to present the system we personally use and recommend.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              If you're figuring out where to start, you're not behind — you're exactly where this was designed
              to meet you.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
