import { motion } from "framer-motion";
import { WHO_ITS_FOR, CURRENT_OFFER } from "../data/content";
import { GradientAura } from "../components/GradientAura";
import { personalChatLink } from "../lib/whatsapp";
import { useCms } from "../context/CmsContext";

const ASK_MESSAGE = "Hi! I'd like to learn more about the S.I.G.C. system before deciding anything.";

export function OfferSection() {
  const { settings } = useCms();
  if (!CURRENT_OFFER.enabled) return null;

  return (
    <section id="offer" className="relative overflow-hidden bg-ink-deep py-24 text-paper md:py-32">
      <GradientAura variant="dark" />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <span className="inline-flex items-center rounded-full border border-paper/20 px-3 py-1 text-xs font-semibold tracking-wide text-paper/70">
          {settings.offerEyebrow}
        </span>
        <h2 className="mt-5 font-display text-3xl leading-tight tracking-tight md:text-4xl">{settings.offerTitle}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">{settings.offerBody}</p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {settings.offerCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-paper/15 bg-paper/5 p-6 backdrop-blur-sm"
            >
              <h3 className="font-display text-lg">{cat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{cat.detail}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 max-w-xl text-sm leading-relaxed text-paper/55">{settings.offerDisclaimer}</p>

        {/* Who it's for */}
        <div className="mt-16 grid gap-10 border-t border-paper/10 pt-14 md:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="font-display text-xl">{WHO_ITS_FOR.title}</h3>
            <ul className="mt-5 space-y-3">
              {WHO_ITS_FOR.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-paper/75">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-paper/50">{WHO_ITS_FOR.note}</p>
          </div>

          <div className="flex flex-col items-start justify-center rounded-2xl border border-gold/30 bg-gold/5 p-8">
            <p className="font-display text-xl text-paper">Have questions before deciding?</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/70">
              Ask us directly — about what's included, how it works, or whether it's a fit for where you are right
              now. No pressure, no obligation.
            </p>
            <a
              href={personalChatLink(ASK_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-deep transition-transform hover:-translate-y-0.5 hover:bg-gold-deep"
            >
              {settings.offerCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
