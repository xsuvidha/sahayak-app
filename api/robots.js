// SAHAYAK — robots.txt
const SITE_URL = process.env.SITE_URL || "https://sahayak-app-sigma.vercel.app";

export default async function handler(req, res) {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/api/sitemap

# Crawl-delay
Crawl-delay: 1

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "s-maxage=86400");
  return res.send(robots);
}
