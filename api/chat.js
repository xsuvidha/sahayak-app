export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, system } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if key exists
    if (!apiKey) {
      return res.status(200).json({
        content: [{ type: 'text', text: 'DEBUG: GEMINI_API_KEY not found in environment!' }]
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Convert messages to Gemini format
    const geminiMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }]
        },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        }
      }),
    });

    const data = await response.json();

    // If Gemini returned an error, show it
    if (data.error) {
      return res.status(200).json({
        content: [{ type: 'text', text: `DEBUG Error: ${data.error.message}` }]
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'कृपया पुनः प्रयास करें।';

    return res.status(200).json({
      content: [{ type: 'text', text }]
    });

  } catch (error) {
    return res.status(200).json({
      content: [{ type: 'text', text: `DEBUG Catch: ${error.message}` }]
    });
  }
}
