// Soft, abstract gradient-blob background. Purely decorative — sits behind
// content with aria-hidden, built from blurred radial gradients in the
// brand's own palette (ink / gold / moss) rather than generic purple-blue.
export function GradientAura({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "panel" | "dark";
  className?: string;
}) {
  if (variant === "dark") {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div
          className="absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-moss) 0%, transparent 70%)" }}
        />
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <div
          className="absolute -top-24 -right-20 h-96 w-96 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-gold-soft) 0%, transparent 72%)" }}
        />
      </div>
    );
  }

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-40 -left-24 h-[30rem] w-[30rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gold-soft) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-10 right-[-6rem] h-[24rem] w-[24rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-moss-soft) 0%, transparent 72%)" }}
      />
      <div
        className="absolute bottom-[-8rem] left-1/3 h-[22rem] w-[22rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 75%)" }}
      />
    </div>
  );
}
