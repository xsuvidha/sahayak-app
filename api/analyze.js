// SAHAYAK Document Analysis API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageBase64, mediaType, agentId, lang, userQuery } = req.body;
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(200).json({ content: [{ type: 'text', text: 'API key missing!' }] });

    const langInst = lang === 'hindi'
      ? 'Respond ENTIRELY in Hindi (Devanagari). Simple language for common person.'
      : lang === 'hinglish'
      ? 'Respond in Hinglish — Hindi (Devanagari) + English technical terms.'
      : 'Respond in clear English.';

    const prompts = {
      gst: `You are SAHAYAK's GST & Tax expert. Analyze this document. ${langInst}
1. Document type & notice number
2. Key amounts and deadlines
3. Simple explanation of what it means
4. EXACT steps to take (numbered)
5. Urgency: 🔴 Urgent / 🟡 Important / 🟢 Routine
${userQuery ? `User's question: ${userQuery}` : ''}`,
      legal: `You are SAHAYAK's legal advisor. Analyze this legal document. ${langInst}
1. Document type and parties involved
2. Key dates and demands
3. Simple explanation
4. ⚠️ Urgent risks or deadlines
5. Recommended actions
${userQuery ? `User's question: ${userQuery}` : ''}`,
      insurance: `You are SAHAYAK's VLE-IRDAI insurance expert. Analyze this insurance document. ${langInst}
1. Document type (policy/claim/rejection/notice)
2. Key coverage and amounts
3. What IS and is NOT covered
4. Any issues flagged
5. Action steps
${userQuery ? `User's question: ${userQuery}` : ''}`,
    };

    const systemPrompt = prompts[agentId] || prompts.gst;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: `data:${mediaType};base64,${imageBase64}` } },
              { type: 'text', text: 'Analyze this document carefully and provide complete analysis as instructed.' }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(200).json({ content: [{ type: 'text', text: lang === 'hindi' 
        ? '📄 दस्तावेज़ प्राप्त हुआ! कृपया WhatsApp पर +918115776644 भेजें — 2 मिनट में विश्लेषण।'
        : '📄 Document received! Please send to WhatsApp +918115776644 for analysis in 2 minutes.' }] });
    }

    const text = data?.choices?.[0]?.message?.content || 'Analysis failed. Please try again.';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (error) {
    return res.status(200).json({ content: [{ type: 'text', text: `Error: ${error.message}` }] });
  }
}
