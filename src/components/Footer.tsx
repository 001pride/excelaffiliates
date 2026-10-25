import { Link } from "react-router-dom";
import { FOOTER } from "../data/content";
import { communityGroupLink } from "../lib/whatsapp";
import { useCms } from "../context/CmsContext";

export function Footer() {
  const { settings } = useCms();
  return (
    <footer className="border-t border-paper-line bg-paper py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-display text-lg text-ink">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="11" cy="11" r="3" fill="var(--color-gold)" />
              </svg>
              {settings.brand}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{FOOTER.closing}</p>
            <a
              href={communityGroupLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block text-sm font-medium text-gold-deep hover:text-ink"
            >
              Join the WhatsApp community
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-ink-soft sm:grid-cols-3">
            {FOOTER.links.map((link) => (
              <Link key={link.label} to={link.href} className="transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-paper-line pt-6 text-xs leading-relaxed text-ink-soft/70">
          {settings.brand} is an independent affiliate-marketing business. We may earn a commission when you purchase
          through our affiliate links, at no additional cost to you. See our{" "}
          <Link to="/disclosure" className="underline hover:text-ink">
            affiliate disclosure
          </Link>{" "}
          for details.
        </div>

        <div className="mt-6 flex flex-col-reverse items-start gap-4 text-xs text-ink-soft/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} {settings.brand}. All rights reserved.</p>
          <p className="tracking-wide">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
