import { motion } from "framer-motion";
import { useCms } from "../context/CmsContext";
import { GradientAura } from "./GradientAura";

export function Hero() {
  const { settings } = useCms();
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <GradientAura variant="hero" />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10 grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-ink md:text-6xl"
          >
            {settings.heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
          >
            {settings.heroSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#qualifier"
              className="rounded-full bg-gold px-7 py-3.5 text-[0.95rem] font-semibold text-ink-deep shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-gold-deep"
            >
              {settings.heroCtaPrimary}
            </a>
            <a
              href="#framework"
              className="text-[0.95rem] font-medium text-ink-soft underline decoration-paper-line underline-offset-4 transition-colors hover:text-ink"
            >
              {settings.heroCtaSecondary}
            </a>
          </motion.div>

          <p className="mt-5 text-sm text-ink-soft/70">{settings.heroMicrocopy}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <OrbitHero />
        </motion.div>
      </div>
    </section>
  );
}

function OrbitHero() {
  const nodes = [
    { angle: -40, r: 150, size: 14, delay: 0 },
    { angle: 60, r: 170, size: 10, delay: 0.15 },
    { angle: 150, r: 140, size: 12, delay: 0.3 },
    { angle: 225, r: 165, size: 9, delay: 0.45 },
    { angle: 290, r: 150, size: 11, delay: 0.6 },
  ];

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <circle cx="200" cy="200" r="150" stroke="var(--color-ink)" strokeOpacity="0.1" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="100" stroke="var(--color-ink)" strokeOpacity="0.14" strokeWidth="1" fill="none" />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 200px" }}
      >
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 200 + n.r * Math.cos(rad);
          const y = 200 + n.r * Math.sin(rad);
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={n.size}
              fill={i === 0 ? "var(--color-gold)" : "var(--color-ink)"}
              fillOpacity={i === 0 ? 1 : 0.16 + i * 0.03}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + n.delay, ease: "backOut" }}
            />
          );
        })}
      </motion.g>

      <circle cx="200" cy="200" r="46" fill="var(--color-ink)" />
      <circle cx="200" cy="200" r="46" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
      <text
        x="200"
        y="206"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="20"
        fill="var(--color-paper)"
      >
        S.I.G.C.
      </text>
    </svg>
  );
}
