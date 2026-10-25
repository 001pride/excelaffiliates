// Generated stand-in visual for a testimonial that has no safe photo to
// show. Abstract gradient + the headline figure, rather than a stock photo
// or a raw forwarded screenshot — keeps things honest and on-brand.
export function ResultVisual({ tag, seed = 0 }: { tag?: string; seed?: number }) {
  const angle = 20 + (seed % 5) * 22;
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(${angle}deg, var(--color-ink-deep) 0%, var(--color-ink) 55%, var(--color-moss) 130%)`,
      }}
    >
      <div
        className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-50 blur-2xl"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-3rem] left-[-2rem] h-36 w-36 rounded-full opacity-30 blur-2xl"
        style={{ background: "radial-gradient(circle, var(--color-paper) 0%, transparent 75%)" }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        aria-hidden
        preserveAspectRatio="none"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="80" fill="none" stroke="var(--color-paper)" strokeWidth="1" />
        <circle cx="100" cy="100" r="55" fill="none" stroke="var(--color-paper)" strokeWidth="1" />
      </svg>
      {tag && (
        <span className="relative px-6 text-center font-display text-2xl leading-snug text-paper md:text-3xl">
          {tag}
        </span>
      )}
    </div>
  );
}
