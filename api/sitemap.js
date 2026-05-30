// ════════════════════════════════════════════════════════
// SAHAYAK — Dynamic Sitemap Generator
// URL: /api/sitemap → Auto-generates sitemap.xml daily
// ════════════════════════════════════════════════════════

const SITE_URL = process.env.SITE_URL || "https://sahayak-app-sigma.vercel.app";

export default async function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];

  const pages = [
    { url: "/",              priority: "1.0",  freq: "daily"   },
    { url: "/?agent=life",   priority: "0.9",  freq: "weekly"  },
    { url: "/?agent=health", priority: "0.9",  freq: "weekly"  },
    { url: "/?agent=motor",  priority: "0.85", freq: "weekly"  },
    { url: "/?agent=crop",   priority: "0.85", freq: "weekly"  },
    { url: "/?agent=gst",    priority: "0.9",  freq: "daily"   },
    { url: "/?agent=loan",   priority: "0.85", freq: "weekly"  },
    { url: "/?agent=solar",  priority: "0.95", freq: "daily"   },
    { url: "/?screen=about", priority: "0.6",  freq: "monthly" },
    { url: "/?screen=policy",priority: "0.5",  freq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="hi" href="${SITE_URL}${p.url}&amp;lang=hindi"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${p.url}&amp;lang=english"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${p.url}"/>
  </url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400"); // 24 hours
  return res.send(sitemap);
}
