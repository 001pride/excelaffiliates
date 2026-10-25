import type { ReactNode } from "react";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="pt-36 pb-24 md:pt-44">
      <article className="mx-auto max-w-2xl px-6 md:px-10">
        <h1 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">{title}</h1>
        <div className="legal-prose mt-8 space-y-5 text-[0.98rem] leading-relaxed text-ink-soft">{children}</div>
      </article>
      <style>{`
        .legal-prose h2 {
          margin-top: 1.75rem;
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--color-ink);
        }
        .legal-prose p { margin-top: 0.5rem; }
      `}</style>
    </main>
  );
}
