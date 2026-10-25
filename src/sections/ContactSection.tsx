import { useCms } from "../context/CmsContext";
import { personalChatLink } from "../lib/whatsapp";

export function ContactSection() {
  const { settings } = useCms();
  return (
    <section id="contact" className="bg-paper-dim py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
          Talk to a real person
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          Questions about {settings.brand}, the S.I.G.C. system, or just not sure where you fit — reach out directly.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={personalChatLink("Hi! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 hover:bg-ink-deep"
          >
            Message on WhatsApp
          </a>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="text-sm font-medium text-ink-soft underline decoration-paper-line underline-offset-4 transition-colors hover:text-ink"
          >
            {settings.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
