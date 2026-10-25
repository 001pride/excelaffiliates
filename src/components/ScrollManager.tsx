import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to top on route change, or to the matching element when a route
// carries a #hash (e.g. navigating from a blog post to "/#qualifier").
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
