// SAHAYAK API Route — GROQ Backend
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(200).json({ content: [{ type: 'text', text: 'GROQ_API_KEY missing!' }] });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ]
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(200).json({ content: [{ type: 'text', text: `Error: ${data.error.message}` }] });
    const text = data?.choices?.[0]?.message?.content || 'पुनः प्रयास करें।';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (error) {
    return res.status(200).json({ content: [{ type: 'text', text: `Error: ${error.message}` }] });
  }
}
