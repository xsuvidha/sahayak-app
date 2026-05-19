// SAHAYAK Lead Capture → Airtable CRM
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, agentId, agentName, lang, summary, highIntent } = req.body;
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const table = process.env.AIRTABLE_TABLE || 'Leads';

    const waLink = `https://wa.me/91${phone}?text=Namaste%20${name}%20ji!%20SAHAYAK%20se%20aap%20ki%20${agentName}%20ke%20baare%20mein%20query%20mili.%20Main%20aapki%20kaise%20madad%20kar%20sakta%20hoon?`;
    const priority = highIntent ? '🔥 High' : '📋 Normal';
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (token && baseId) {
      const airtableRes = await fetch(`https://api.airtable.com/v0/${baseId}/${table}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            Name: name || 'Unknown',
            Phone: `+91${phone}`,
            Agent: agentName,
            'Agent ID': agentId,
            Language: lang,
            Priority: priority,
            'WhatsApp Link': waLink,
            Conversation: summary?.slice(0, 500) || '',
            Status: 'New',
            Source: 'SAHAYAK App',
            Created: timestamp,
          }
        })
      });
      const airtableData = await airtableRes.json();
      return res.status(200).json({ success: true, crm_saved: true, record_id: airtableData.id, wa_link: waLink });
    }

    return res.status(200).json({ success: true, crm_saved: false, wa_link: waLink });
  } catch (error) {
    return res.status(200).json({ success: false, error: error.message });
  }
}
