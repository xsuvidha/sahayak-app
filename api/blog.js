// SAHAYAK — Blog Posts API
const AT_TOKEN   = process.env.AIRTABLE_TOKEN;
const AT_BASE    = process.env.AIRTABLE_BASE_ID;
const POST_TABLE = process.env.AIRTABLE_BLOG_POSTS || "Blog Posts";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");

  try {
    if (!AT_TOKEN || !AT_BASE) return res.status(200).json({ posts: [], source: "no-config" });

    const url = `https://api.airtable.com/v0/${AT_BASE}/${encodeURIComponent(POST_TABLE)}`
      + `?filterByFormula={Status}='Published'`
      + `&sort[0][field]=Date&sort[0][direction]=desc`
      + `&maxRecords=20`;

    const atRes = await fetch(url, { headers: { "Authorization": `Bearer ${AT_TOKEN}` } });
    if (!atRes.ok) return res.status(200).json({ posts: [], error: "Fetch failed" });

    const data = await atRes.json();
    const posts = (data.records || []).map(r => ({
      id: r.id,
      date: r.fields["Date Display"] || r.fields["Date"] || "",
      title: r.fields["Title"] || "",
      summary: r.fields["Summary"] || "",
      content: r.fields["Content"] || "",
      key_takeaway: r.fields["Key Takeaway"] || "",
      image_url: r.fields["Image URL"] || "",
      image_alt: r.fields["Image Alt"] || r.fields["Title"] || "SAHAYAK Blog",
      category: r.fields["Category"] || "Finance",
      tags: (r.fields["Tags"] || "").split(", ").filter(Boolean),
      reading_time: r.fields["Reading Time"] || "4 min",
      language: r.fields["Language"] || "hindi",
    }));

    return res.status(200).json({ posts, total: posts.length, source: "airtable" });

  } catch (error) {
    return res.status(200).json({ posts: [], error: error.message });
  }
}
