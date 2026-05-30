// ════════════════════════════════════════════════════════
// SAHAYAK — GET Latest SEO Data
// Called by frontend on page load to inject fresh meta tags
// ════════════════════════════════════════════════════════

const AT_TOKEN     = process.env.AIRTABLE_TOKEN;
const AT_BASE      = process.env.AIRTABLE_BASE_ID;
const AT_SEO_TABLE = process.env.AIRTABLE_SEO_TABLE || "SEO";
const SITE_URL     = process.env.SITE_URL || "https://sahayak-app-sigma.vercel.app";

// Default SEO (used before first cron run or if Airtable not set)
const DEFAULT_SEO = {
  title: "SAHAYAK — मुफ्त AI Financial दोस्त | Insurance, GST, Solar India",
  description: "SAHAYAK — भारत का #1 Hindi AI Financial Advisor। Insurance, GST, ITR, Solar Subsidy, Loan — बिल्कुल मुफ्त। UP में ₹1,08,000 सब्सिडी। VLE-IRDAI Certified।",
  keywords: [
    "SAHAYAK app", "Hindi financial advisor", "GST notice help Hindi",
    "PM Surya Ghar subsidy UP", "free insurance advice India",
    "ITR filing Hindi", "PMFBY fasal bima", "solar rooftop subsidy",
    "CIBIL score kaise badhaye", "home loan India Hindi",
    "GST suvidha kendra Balrampur", "VLE IRDAI insurance",
    "sahayak app free", "AI financial app India", "HAANS Solar UP"
  ],
  og_title: "SAHAYAK — आपका मुफ्त AI Financial दोस्त 🇮🇳",
  og_description: "Insurance, GST, Solar Subsidy — Hindi में, बिल्कुल FREE! अभी try करें।",
  blog_headline: "UP में ₹1,08,000 Solar Subsidy — SAHAYAK से मुफ्त Calculate करें",
  local_seo: "Balrampur UP Financial Advisor, GST Suvidha Kendra Balrampur",
  schema_faq: [
    {
      question: "SAHAYAK app क्या है?",
      answer: "SAHAYAK भारत का पहला Hindi AI Financial Advisor है जो Insurance, GST, ITR, Solar Subsidy और Loan के बारे में मुफ्त में सलाह देता है।"
    },
    {
      question: "UP में Solar Subsidy कितनी मिलती है?",
      answer: "UP में PM Surya Ghar योजना के तहत 3KW सोलर पर ₹1,08,000 तक सब्सिडी मिलती है। SAHAYAK app पर मुफ्त Calculate करें।"
    },
    {
      question: "SAHAYAK app कैसे काम करता है?",
      answer: "SAHAYAK एक AI-powered app है जो Hindi और English में आपके financial सवालों का जवाब देता है। बिल्कुल मुफ्त, VLE-IRDAI Certified।"
    }
  ]
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // Cache 1 hour

  try {
    let seoData = DEFAULT_SEO;
    let source = "default";

    // Try to get latest from Airtable
    if (AT_TOKEN && AT_BASE) {
      const atRes = await fetch(
        `https://api.airtable.com/v0/${AT_BASE}/${AT_SEO_TABLE}?maxRecords=1&sort[0][field]=Date&sort[0][direction]=desc&filterByFormula={Status}='Active'`,
        { headers: { "Authorization": `Bearer ${AT_TOKEN}` } }
      );

      if (atRes.ok) {
        const atData = await atRes.json();
        const latest = atData.records?.[0]?.fields;

        if (latest && latest["Title"]) {
          seoData = {
            title: latest["Title"],
            description: latest["Description"],
            keywords: (latest["Keywords"] || "").split(", ").filter(Boolean),
            og_title: latest["OG Title"] || DEFAULT_SEO.og_title,
            og_description: latest["OG Description"] || DEFAULT_SEO.og_description,
            blog_headline: latest["Blog Headline"] || DEFAULT_SEO.blog_headline,
            local_seo: latest["Local SEO"] || DEFAULT_SEO.local_seo,
            schema_faq: JSON.parse(latest["FAQ Schema"] || "[]"),
            topic: latest["Topic"],
            date: latest["Date"],
          };
          source = "airtable";
        }
      }
    }

    // Build full Schema.org JSON-LD
    const schemaFAQs = (seoData.schema_faq || []).map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }));

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "SAHAYAK",
          "alternateName": "सहायक",
          "description": seoData.description,
          "url": SITE_URL,
          "applicationCategory": "FinanceApplication",
          "applicationSubCategory": "Personal Finance",
          "operatingSystem": "Web Browser, Android, iOS",
          "inLanguage": ["hi", "en"],
          "isAccessibleForFree": true,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "author": {
            "@type": "Person",
            "name": "Ankit Singh",
            "email": "xsuvidha@gmail.com"
          },
          "provider": {
            "@type": "LocalBusiness",
            "name": "HAANS Solar®",
            "taxID": "09DIYPS3881N1ZT",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Nawanagar, Chouhattar Kalan",
              "addressLocality": "Balrampur",
              "addressRegion": "Uttar Pradesh",
              "postalCode": "271208",
              "addressCountry": "IN"
            },
            "telephone": "+918115776644",
            "email": "xsuvidha@gmail.com",
            "url": SITE_URL,
            "areaServed": "India",
            "priceRange": "Free"
          }
        },
        ...(schemaFAQs.length > 0 ? [{
          "@type": "FAQPage",
          "mainEntity": schemaFAQs
        }] : []),
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "Insurance Advice", "item": `${SITE_URL}/?agent=life` },
            { "@type": "ListItem", "position": 3, "name": "GST & ITR Help", "item": `${SITE_URL}/?agent=gst` },
            { "@type": "ListItem", "position": 4, "name": "Solar Subsidy", "item": `${SITE_URL}/?agent=solar` },
          ]
        }
      ]
    };

    return res.status(200).json({
      ...seoData,
      schema,
      site_url: SITE_URL,
      source,
      cached: source === "airtable",
    });

  } catch (error) {
    // Always return something — never fail silently
    return res.status(200).json({
      ...DEFAULT_SEO,
      source: "fallback",
      error: error.message
    });
  }
}
