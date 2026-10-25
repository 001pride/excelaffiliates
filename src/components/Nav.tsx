import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCms } from "../context/CmsContext";

export function Nav() {
  const { settings } = useCms();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mt-4 flex items-center justify-between rounded-full border border-ink/10 bg-paper/80 px-5 py-3 backdrop-blur-md shadow-soft">
          <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-tight text-ink">
            <RingMark />
            {settings.brand}
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
            <Link to="/#framework" className="hover:text-ink transition-colors">
              How it works
            </Link>
            <Link to="/#offer" className="hover:text-ink transition-colors">
              S.I.G.C. System
            </Link>
            <Link to="/blog" className="hover:text-ink transition-colors">
              Results
            </Link>
            <Link to="/#about" className="hover:text-ink transition-colors">
              About
            </Link>
            <Link to="/#contact" className="hover:text-ink transition-colors">
              Contact
            </Link>
          </nav>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/#qualifier"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-deep"
            >
              Find your starting point
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

function RingMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11" cy="11" r="3" fill="var(--color-gold)" />
    </svg>
  );
}
