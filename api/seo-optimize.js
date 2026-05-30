// ════════════════════════════════════════════════════════
// SAHAYAK — AI SEO Auto-Optimizer
// Vercel Cron Job: Runs daily at 6:00 AM IST (00:30 UTC)
// 
// What it does:
//  1. Calls GROQ AI → generates fresh SEO content
//  2. Saves to Airtable (SEO table)
//  3. Updates: meta tags, keywords, schema, sitemap ping
//  4. Zero human intervention needed
// ════════════════════════════════════════════════════════

export const config = { maxDuration: 60 };

const GROQ_KEY      = process.env.GROQ_API_KEY;
const AT_TOKEN      = process.env.AIRTABLE_TOKEN;
const AT_BASE       = process.env.AIRTABLE_BASE_ID;
const AT_SEO_TABLE  = process.env.AIRTABLE_SEO_TABLE || "SEO";
const SITE_URL      = process.env.SITE_URL || "https://sahayak-app-sigma.vercel.app";

// ── Topics SAHAYAK covers (for AI prompt) ──
const TOPICS = [
  "GST filing and notices in India 2026",
  "PM Surya Ghar solar subsidy UP 2026",
  "Term life insurance India Hindi",
  "Health insurance family floater India",
  "CIBIL score improvement tips India",
  "ITR filing deadline 2026",
  "PM Fasal Bima Yojana PMFBY",
  "Solar rooftop subsidy government scheme",
  "Motor insurance NCB tips India",
  "Home loan eligibility India 2026",
];

// ── Get today's topic (rotates daily) ──
function getTodayTopic() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return TOPICS[dayOfYear % TOPICS.length];
}

// ── Call GROQ AI for SEO generation ──
async function generateSEO(topic) {
  const today = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "long", year: "numeric"
  });

  const prompt = `You are an expert Indian SEO specialist for SAHAYAK — India's #1 Hindi AI Financial Advisor app.

Today's date: ${today}
Today's focus topic: "${topic}"

Generate optimized SEO content for SAHAYAK app. Respond ONLY in valid JSON:

{
  "title": "Page title (55-60 chars, include SAHAYAK + topic + India)",
  "description": "Meta description (150-160 chars, include free, Hindi, India)",
  "keywords": ["keyword1", "keyword2", ...15 keywords total, mix Hindi+English],
  "og_title": "Open Graph title for social sharing",
  "og_description": "OG description (100-120 chars)",
  "schema_faq": [
    {"question": "Question in Hindi/English", "answer": "Answer (2-3 sentences)"},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "blog_headline": "Catchy Hindi blog headline for today's topic",
  "search_queries": ["top 5 search queries Indians use for this topic"],
  "local_seo": "UP, Balrampur specific local SEO phrase",
  "updated": "${today}"
}

Rules:
- Title MUST contain "SAHAYAK" and "मुफ्त" or "Free"
- Keywords MUST include Hindi words (Devanagari)
- Focus on Uttar Pradesh, India geographic targeting
- Include long-tail keywords Indians actually search
- schema_faq must be real questions people ask Google`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an SEO expert. Respond ONLY with valid JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── Save SEO data to Airtable ──
async function saveSEOToAirtable(seoData, topic) {
  if (!AT_TOKEN || !AT_BASE) return { saved: false, reason: "Airtable not configured" };

  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  const record = {
    fields: {
      "Date": today,
      "Topic": topic,
      "Title": seoData.title || "",
      "Description": seoData.description || "",
      "Keywords": (seoData.keywords || []).join(", "),
      "OG Title": seoData.og_title || "",
      "OG Description": seoData.og_description || "",
      "Blog Headline": seoData.blog_headline || "",
      "Search Queries": (seoData.search_queries || []).join(" | "),
      "Local SEO": seoData.local_seo || "",
      "FAQ Schema": JSON.stringify(seoData.schema_faq || []),
      "Status": "Active",
    }
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${AT_BASE}/${AT_SEO_TABLE}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(record)
    }
  );

  const data = await res.json();
  return { saved: !data.error, id: data.id, error: data.error };
}

// ── Ping Google Search Console to index ──
async function pingSitemap() {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    // Ping Google
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    // Ping Bing
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    return { pinged: true };
  } catch {
    return { pinged: false };
  }
}

// ── Generate Schema.org JSON-LD ──
function generateSchema(seoData) {
  const faqs = (seoData.schema_faq || []).map(f => ({
    "@type": "Question",
    "name": f.question,
    "acceptedAnswer": { "@type": "Answer", "text": f.answer }
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "SAHAYAK",
        "description": seoData.description,
        "url": SITE_URL,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web, Android, iOS",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        "author": {
          "@type": "Person",
          "name": "Ankit Singh",
          "affiliation": { "@type": "Organization", "name": "HAANS Solar" }
        },
        "provider": {
          "@type": "Organization",
          "name": "HAANS Solar®",
          "taxID": "09DIYPS3881N1ZT",
          "areaServed": "India"
        }
      },
      ...(faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": faqs
      }] : [])
    ]
  };
}

// ════════════════════════════════════════
// MAIN HANDLER
// ════════════════════════════════════════
export default async function handler(req, res) {
  // Security: Only allow Vercel cron or manual trigger with secret
  const authHeader = req.headers["authorization"];
  const cronSecret = process.env.CRON_SECRET || "sahayak-seo-2026";

  if (req.method !== "GET" ||
      (authHeader !== `Bearer ${cronSecret}` &&
       !req.headers["x-vercel-cron"])) {
    // For manual browser access, still allow but log
    console.log("Manual SEO trigger accessed");
  }

  const startTime = Date.now();

  try {
    if (!GROQ_KEY) {
      return res.status(200).json({ success: false, error: "GROQ_API_KEY missing" });
    }

    // Step 1: Get today's topic
    const topic = getTodayTopic();
    console.log(`[SEO] Optimizing for topic: ${topic}`);

    // Step 2: Generate SEO with AI
    const seoData = await generateSEO(topic);
    console.log(`[SEO] Generated: ${seoData.title}`);

    // Step 3: Generate Schema
    const schema = generateSchema(seoData);

    // Step 4: Save to Airtable
    const airtable = await saveSEOToAirtable(seoData, topic);

    // Step 5: Ping search engines
    const ping = await pingSitemap();

    const duration = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
      topic,
      seo: {
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        og_title: seoData.og_title,
        blog_headline: seoData.blog_headline,
        local_seo: seoData.local_seo,
      },
      schema,
      airtable,
      sitemap_ping: ping,
      duration_ms: duration,
      next_run: "Tomorrow 6:00 AM IST (Auto)"
    });

  } catch (error) {
    console.error("[SEO] Error:", error);
    return res.status(200).json({
      success: false,
      error: error.message,
      duration_ms: Date.now() - startTime
    });
  }
}
