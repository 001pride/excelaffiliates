import { Helmet } from "react-helmet-async";
import { SITE } from "../data/content";

export interface SeoProps {
  title: string;
  description: string;
  path: string; // e.g. "/" or "/blog/some-slug"
  image?: string; // absolute or root-relative path to a social preview image
  type?: "website" | "article";
  keywords?: string[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

// If you add a custom domain later, update this (and sitemap.xml / robots.txt)
// to match — absolute URLs are required for Open Graph / canonical tags to work correctly.
export const SITE_URL = "https://excelaffiliates.vercel.app";
export const DEFAULT_OG_IMAGE = "/og-default.jpg";

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  keywords,
  jsonLd,
  noindex = false,
}: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content={SITE.brand} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {jsonLdList.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
