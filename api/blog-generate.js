// ════════════════════════════════════════════════════════
// SAHAYAK — Daily Blog Generator
// Cron: 13:30 UTC = 7:00 PM IST daily
// Features:
//   • Human-style writing (no AI feel)
//   • AI image via Pollinations.ai (FREE, no API key)
//   • SAHAYAK watermark added on frontend
// ════════════════════════════════════════════════════════

export const config = { maxDuration: 60 };

const GROQ_KEY  = process.env.GROQ_API_KEY;
const AT_TOKEN  = process.env.AIRTABLE_TOKEN;
const AT_BASE   = process.env.AIRTABLE_BASE_ID;
const CAL_TABLE = process.env.AIRTABLE_BLOG_CALENDAR || "Blog Calendar";
const POST_TABLE= process.env.AIRTABLE_BLOG_POSTS    || "Blog Posts";

function getTodayIST() {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit"
  }).split("/").reverse().join("-");
}

function getTodayDisplay() {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "long", year: "numeric"
  });
}

// ── Fetch today's topic from Blog Calendar ──
async function getTodayTopic(dateIST) {
  if (!AT_TOKEN || !AT_BASE) return null;

  // Strategy 1: Try to find topic matching today's date
  const urlByDate = `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(CAL_TABLE)}?filterByFormula={Date}='${dateIST}'&maxRecords=1`;
  const resByDate = await fetch(urlByDate, { headers: { "Authorization": `Bearer ${AT_TOKEN}` } });
  
  if (resByDate.ok) {
    const dataByDate = await resByDate.json();
    const byDate = dataByDate.records?.[0];
    if (byDate?.fields?.["Topic"]) {
      return {
        id: byDate.id,
        topic: byDate.fields["Topic"],
        category: byDate.fields["Category"] || "Finance",
        lang: byDate.fields["Language"] || "hindi",
        keywords: byDate.fields["Keywords"] || "",
        notes: byDate.fields["Notes"] || "",
      };
    }
  }

  // Strategy 2: Fallback — pick oldest "Scheduled" topic (no date needed)
  const urlScheduled = `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(CAL_TABLE)}?filterByFormula={Status}='Scheduled'&maxRecords=1&sort[0][field]=Created Time&sort[0][direction]=asc`;
  const resScheduled = await fetch(urlScheduled, { headers: { "Authorization": `Bearer ${AT_TOKEN}` } });

  if (!resScheduled.ok) return null;
  const dataScheduled = await resScheduled.json();
  const record = dataScheduled.records?.[0];
  if (!record?.fields?.["Topic"]) return null;

  return {
    id: record.id,
    topic: record.fields["Topic"],
    category: record.fields["Category"] || "Finance",
    lang: record.fields["Language"] || "hindi",
    keywords: record.fields["Keywords"] || "",
    notes: record.fields["Notes"] || "",
  };
}

// ── Generate AI image prompt ──
function buildImagePrompt(topic, category) {
  const categoryVisuals = {
    "Solar":      "bright solar panels on Indian rooftop, sunny day, village home, clean energy, warm golden sunlight",
    "GST & Tax":  "Indian businessman doing paperwork at desk, documents, calculator, professional office setting, warm lighting",
    "Insurance":  "happy Indian family under umbrella protection, bright colors, safety and security, home background",
    "Finance":    "Indian person counting money, piggy bank, growth chart arrow going up, financial success, warm tones",
    "Loan":       "Indian couple holding house keys, new home, bank document signing, hopeful expression, bright",
    "default":    "Indian financial success story, professional, warm colors, positive energy, modern India"
  };

  const visual = categoryVisuals[category] || categoryVisuals["default"];
  return `${visual}, professional photography style, high quality, vibrant colors, no text, no watermark, 16:9 ratio, sharp focus, Indian setting`;
}

// ── Generate blog image via Pollinations.ai (FREE) ──
async function generateBlogImage(topic, category) {
  try {
    const imagePrompt = buildImagePrompt(topic, category);
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const seed = Math.floor(Math.random() * 999999);

    // Pollinations.ai - completely free, no API key needed
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&seed=${seed}&nologo=true&enhance=true`;

    // Verify image loads (HEAD request)
    const check = await fetch(imageUrl, { method: "HEAD" });
    if (check.ok) {
      return { url: imageUrl, prompt: imagePrompt };
    }
    return { url: null, prompt: imagePrompt };
  } catch {
    return { url: null, prompt: "" };
  }
}

// ── Generate blog post via GROQ ──
async function generateBlogPost(topicData, dateDisplay) {
  const { topic, category, lang, keywords, notes } = topicData;
  const isHindi = lang === "hindi";

  const prompt = `You are a seasoned financial expert and warm storyteller writing for everyday Indians.

Write a blog post in ${isHindi ? "pure Hindi (Devanagari script, conversational tone)" : "simple, warm English"} on:

Topic: ${topic}
Category: ${category}
Date: ${dateDisplay}
Focus keywords: ${keywords || "finance, India, practical advice"}
${notes ? `Important points to cover: ${notes}` : ""}

Writing style:
- Write like a knowledgeable friend or elder explaining at a chai ki dukaan
- Use simple words, real examples from daily Indian life
- Include actual numbers, government scheme names, practical tips
- Stories and analogies are welcome (e.g., compare insurance to छाता/umbrella)
- Warm, trustworthy, never preachy
- Short paragraphs (2-3 sentences each)
- DO NOT sound robotic or formal
- NO mention of AI, ChatGPT, or automation anywhere
- Mention SAHAYAK app once naturally as a helpful free tool

Respond ONLY in valid JSON:
{
  "title": "${isHindi ? "Hindi mein" : "English"} catchy title (max 75 chars, no clickbait)",
  "summary": "2-3 sentence engaging summary",
  "content": "Full article 700-900 words with \\n between paragraphs. Natural, human writing.",
  "image_alt": "Description of ideal image for this article (for accessibility)",
  "category": "${category}",
  "tags": ["tag1","tag2","tag3","tag4","tag5"],
  "reading_time": "4 min",
  "key_takeaway": "One powerful sentence summary ${isHindi ? "in Hindi" : "in English"}"
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2500,
      temperature: 0.72,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an expert Indian financial writer. Human, warm, practical. Respond ONLY with valid JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── Save to Airtable ──
async function saveBlogPost(post, image, topicData, dateIST, dateDisplay) {
  if (!AT_TOKEN || !AT_BASE) return { saved: false };

  const record = {
    fields: {
      "Date":         dateIST,
      "Date Display": dateDisplay,
      "Title":        post.title || "",
      "Summary":      post.summary || "",
      "Content":      post.content || "",
      "Key Takeaway": post.key_takeaway || "",
      "Image URL":    image.url || "",
      "Image Alt":    post.image_alt || "",
      "Category":     post.category || topicData.category,
      "Tags":         (post.tags || []).join(", "),
      "Reading Time": post.reading_time || "4 min",
      "Language":     topicData.lang,
      "Status":       "Published",
      "Topic":        topicData.topic,
    }
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(POST_TABLE)}`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${AT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }
  );
  const data = await res.json();

  // Mark calendar as Published
  if (topicData.id && !data.error) {
    await fetch(
      `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(CAL_TABLE)}/${topicData.id}`,
      {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${AT_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { "Status": "Published" } })
      }
    );
  }

  return { saved: !data.error, id: data.id, error: data.error };
}

// ── Main Handler ──
export default async function handler(req, res) {
  const start = Date.now();
  const dateIST = getTodayIST();
  const dateDisplay = getTodayDisplay();

  try {
    if (!GROQ_KEY) return res.status(200).json({ success: false, error: "GROQ_API_KEY missing" });

    const topicData = await getTodayTopic(dateIST);
    if (!topicData?.topic) {
      return res.status(200).json({
        success: false,
        message: "No topic scheduled for today",
        date: dateIST,
        hint: "Add row in Blog Calendar with today\'s date"
      });
    }

    // Run blog + image generation in parallel
    const [post, image] = await Promise.all([
      generateBlogPost(topicData, dateDisplay),
      generateBlogImage(topicData.topic, topicData.category)
    ]);

    if (!post.title) return res.status(200).json({ success: false, error: "Blog generation failed" });

    const saved = await saveBlogPost(post, image, topicData, dateIST, dateDisplay);

    return res.status(200).json({
      success: true,
      date: dateIST,
      topic: topicData.topic,
      post: {
        title: post.title,
        summary: post.summary,
        key_takeaway: post.key_takeaway,
        category: post.category,
        reading_time: post.reading_time,
        tags: post.tags,
        image_url: image.url,
      },
      saved,
      duration_ms: Date.now() - start,
      next_run: "Tomorrow 7:00 PM IST (Auto)"
    });

  } catch (error) {
    return res.status(200).json({ success: false, error: error.message, duration_ms: Date.now() - start });
  }
}
