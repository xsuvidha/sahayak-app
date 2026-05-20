import { useState, useRef, useEffect, useCallback } from "react";

const LOGO = "/logo.svg?v=3";
const WA_NUMBER = "918115776644";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const TOKENS = {
  colors: {
    bg: "#050508",
    surface: "rgba(255,255,255,0.03)",
    surfaceHover: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.12)",
    text: "#f0f0f5",
    textMuted: "rgba(240,240,245,0.45)",
    textDim: "rgba(240,240,245,0.25)",
    accent: "#8b5cf6",
    accentGlow: "rgba(139,92,246,0.3)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  blur: {
    sm: "blur(8px)",
    md: "blur(16px)",
    lg: "blur(24px)",
    xl: "blur(40px)",
  },
};

const UI = {
  hindi: {
    appSub: "GST सुविधा • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 बीमा • टैक्स • सोलर — एक ही जगह",
    headline1: "हर वित्तीय समस्या का",
    headline2: "सरल समाधान",
    sub: "बिल्कुल मुफ्त • हिंदी और English • पूरे भारत में",
    solarBanner: "PM सूर्य घर — अभी चेक करें!",
    solarSub: "UP में ₹1,08,000 तक सब्सिडी • मुफ्त सर्वे",
    otherExperts: "अपने विशेषज्ञ चुनें 👇",
    chatOnWA: "सीधे WhatsApp पर बात करें",
    free: "निःशुल्क",
    certified: "सुरक्षित • VLE-IRDAI प्रमाणित • MFINS Solar",
    online: "ऑनलाइन • निःशुल्क",
    expert: "विशेषज्ञ",
    askHere: "अपना सवाल लिखें... (हिंदी या English में)",
    listen: "सुनें",
    stop: "रोकें",
    callback: "🎯 एक्सपर्ट से बात करें!",
    callbackSub: "हमारे विशेषज्ञ 2 मिनट में WhatsApp पर जवाब देंगे",
    namePlaceholder: "आपका नाम",
    phonePlaceholder: "मोबाइल नंबर (10 अंक)",
    sendWA: "WhatsApp पर भेजें",
    later: "बाद में",
    calcTitle: "सब्सिडी कैलकुलेटर",
    capacity: "क्षमता (KW)",
    state: "राज्य",
    home: "🏠 घर",
    commercial: "🏭 व्यावसायिक",
    centralSub: "केंद्र सब्सिडी",
    stateExtra: "UP अतिरिक्त",
    totalSub: "कुल सब्सिडी",
    netCost: "अनुमानित लागत",
    annualSaving: "सालाना बचत",
    payback: "वापसी अवधि",
    years: "साल",
    surveyBtn: "मुफ्त सर्वे के लिए WhatsApp करें",
    commercialNote: "व्यावसायिक सोलर पर PM सूर्य घर सब्सिडी नहीं मिलती।\n• 40% त्वरित मूल्यह्रास लाभ\n• नेट मीटरिंग से बिजली बेचें\n• 5-7 साल में ROI",
    voiceStart: "बोलें...",
    voiceStop: "रुकें",
    typing: "सोच रहा हूँ...",
    trustBadge: "🔒 100% सुरक्षित • कोई स्पैम नहीं",
  },
  english: {
    appSub: "GST Suvidha • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 INSURANCE • TAX • SOLAR — ONE PLATFORM",
    headline1: "Simple answers to every",
    headline2: "financial question",
    sub: "100% Free • Hindi & English • Pan-India",
    solarBanner: "PM Surya Ghar — Check Now!",
    solarSub: "UP subsidy upto ₹1,08,000 • Free Site Survey",
    otherExperts: "Choose your expert 👇",
    chatOnWA: "Chat directly on WhatsApp",
    free: "Free",
    certified: "Secure • VLE-IRDAI Certified • MFINS Solar",
    online: "Online • Free",
    expert: "Expert",
    askHere: "Ask your question... (Hindi or English)",
    listen: "Listen",
    stop: "Stop",
    callback: "🎯 Talk to an Expert!",
    callbackSub: "Our expert will reply on WhatsApp in 2 minutes",
    namePlaceholder: "Your name",
    phonePlaceholder: "Mobile number (10 digits)",
    sendWA: "Send on WhatsApp",
    later: "Later",
    calcTitle: "Subsidy Calculator",
    capacity: "Capacity (KW)",
    state: "State",
    home: "🏠 Home",
    commercial: "🏭 Commercial",
    centralSub: "Central Subsidy",
    stateExtra: "UP Extra",
    totalSub: "Total Subsidy",
    netCost: "Net Cost",
    annualSaving: "Annual Saving",
    payback: "Payback",
    years: "yrs",
    surveyBtn: "WhatsApp for Free Site Survey",
    commercialNote: "No PM Surya Ghar subsidy for commercial.\n• 40% accelerated depreciation\n• Net metering benefit\n• ROI in 5-7 years",
    voiceStart: "Speak...",
    voiceStop: "Stop",
    typing: "Thinking...",
    trustBadge: "🔒 100% Secure • No Spam Ever",
  }
};

const AGENTS = {
  hindi: [
    { id:"life", icon:"🛡️", name:"जीवन बीमा", tag:"परिवार का भविष्य सुरक्षित", color:"#ef4444", glow:"rgba(239,68,68,0.3)", grad:"135deg,#ef4444,#991b1b", iconBg:"rgba(239,68,68,0.15)",
      starters:["मुझे कितने का बीमा लेना चाहिए?","टर्म प्लान क्या होता है?","LIC और प्राइवेट में फर्क?"] },
    { id:"health", icon:"🏥", name:"स्वास्थ्य बीमा", tag:"बीमारी का खर्च, बीमा उठाएगा", color:"#10b981", glow:"rgba(16,185,129,0.3)", grad:"135deg,#10b981,#065f46", iconBg:"rgba(16,185,129,0.15)",
      starters:["फैमिली फ्लोटर क्या होता है?","आयुष्मान भारत मिलेगा?","पहले से बीमारी कवर होती है?"] },
    { id:"motor", icon:"🚗", name:"मोटर बीमा", tag:"गाड़ी सुरक्षित, मन शांत", color:"#3b82f6", glow:"rgba(59,130,246,0.3)", grad:"135deg,#3b82f6,#1e40af", iconBg:"rgba(59,130,246,0.15)",
      starters:["थर्ड पार्टी और कॉम्प्रिहेंसिव में फर्क?","NCB कैसे बचाएं?","ज़ीरो डेप्रिसिएशन लेना चाहिए?"] },
    { id:"crop", icon:"🌾", name:"फसल बीमा", tag:"फसल की सुरक्षा — किसान का अधिकार", color:"#f59e0b", glow:"rgba(245,158,11,0.3)", grad:"135deg,#f59e0b,#92400e", iconBg:"rgba(245,158,11,0.15)",
      starters:["PMFBY में कैसे आवेदन करें?","प्रीमियम कितना लगेगा?","दावा कैसे मिलेगा?"] },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"टैक्स की टेंशन खत्म", color:"#8b5cf6", glow:"rgba(139,92,246,0.3)", grad:"135deg,#8b5cf6,#5b21b6", iconBg:"rgba(139,92,246,0.15)",
      starters:["GST नोटिस आया — क्या करूं?","कौन सा ITR फॉर्म भरें?","टैक्स कैसे बचाएं?"] },
    { id:"loan", icon:"💎", name:"लोन & निवेश", tag:"सही लोन, सही निवेश — आपका हक", color:"#14b8a6", glow:"rgba(20,184,166,0.3)", grad:"135deg,#14b8a6,#0f766e", iconBg:"rgba(20,184,166,0.15)",
      starters:["होम लोन मिलेगा?","CIBIL स्कोर कैसे बढ़ाएं?","₹5000/माह कहाँ निवेश करें?"] },
    { id:"solar", icon:"☀️", name:"सोलर रूफटॉप", tag:"मुफ्त बिजली, सरकारी सब्सिडी", color:"#f97316", glow:"rgba(249,115,22,0.35)", grad:"135deg,#f97316,#c2410c", iconBg:"rgba(249,115,22,0.15)", solar:true,
      starters:["UP में कितनी सब्सिडी मिलेगी?","3KW सोलर का खर्च?","EMI पर सोलर मिलेगा?"] },
  ],
  english: [
    { id:"life", icon:"🛡️", name:"Life Insurance", tag:"Secure your family's future", color:"#ef4444", glow:"rgba(239,68,68,0.3)", grad:"135deg,#ef4444,#991b1b", iconBg:"rgba(239,68,68,0.15)",
      starters:["How much life cover do I need?","What is a term plan?","LIC vs private insurance?"] },
    { id:"health", icon:"🏥", name:"Health Insurance", tag:"Your health, our priority", color:"#10b981", glow:"rgba(16,185,129,0.3)", grad:"135deg,#10b981,#065f46", iconBg:"rgba(16,185,129,0.15)",
      starters:["What is a family floater?","Am I eligible for Ayushman Bharat?","Are pre-existing diseases covered?"] },
    { id:"motor", icon:"🚗", name:"Motor Insurance", tag:"Drive safe, stay covered", color:"#3b82f6", glow:"rgba(59,130,246,0.3)", grad:"135deg,#3b82f6,#1e40af", iconBg:"rgba(59,130,246,0.15)",
      starters:["Third party vs comprehensive?","How to protect my NCB?","Is zero depreciation worth it?"] },
    { id:"crop", icon:"🌾", name:"Crop Insurance", tag:"Farmer's right — crop protection", color:"#f59e0b", glow:"rgba(245,158,11,0.3)", grad:"135deg,#f59e0b,#92400e", iconBg:"rgba(245,158,11,0.15)",
      starters:["How to apply for PMFBY?","What is the premium amount?","How to file a crop damage claim?"] },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"No more tax tension", color:"#8b5cf6", glow:"rgba(139,92,246,0.3)", grad:"135deg,#8b5cf6,#5b21b6", iconBg:"rgba(139,92,246,0.15)",
      starters:["Got a GST notice — what to do?","Which ITR form to file?","How to save maximum tax?"] },
    { id:"loan", icon:"💎", name:"Loan & Finance", tag:"Right loan, right investment", color:"#14b8a6", glow:"rgba(20,184,166,0.3)", grad:"135deg,#14b8a6,#0f766e", iconBg:"rgba(20,184,166,0.15)",
      starters:["Will I get a home loan?","How to improve CIBIL score?","Where to invest ₹5000/month?"] },
    { id:"solar", icon:"☀️", name:"Solar Rooftop", tag:"Free electricity, govt subsidy", color:"#f97316", glow:"rgba(249,115,22,0.35)", grad:"135deg,#f97316,#c2410c", iconBg:"rgba(249,115,22,0.15)", solar:true,
      starters:["How much subsidy in UP?","Cost of 3KW solar?","Solar on EMI?"] },
  ]
};

function detectLang(t) {
  if (/[\u0900-\u097F]/.test(t)) return "hindi";
  if (/\b(kya|hai|mujhe|mera|aap|nahi|haan|karo|kitna|kaise|kyun|chahiye|batao|bilkul|abhi|toh|aur|ya|se|ke|ka|ki|ko|me|pe|ho|hoga|woh|yeh|sab|bahut|solar|bijli|ghar|bima|loan|agar)\b/i.test(t)) return "hinglish";
  return "english";
}

function langInst(lang) {
  if (lang === "hindi") return "Respond ENTIRELY in proper Hindi using Devanagari script. Keep technical terms like GST, ITR, EMI, CIBIL, KW, SIP, FD in English.";
  if (lang === "hinglish") return "Respond in Hinglish — Hindi (Devanagari) for conversational words, English for technical terms. Use masculine form.";
  return "Respond entirely in clear, professional English.";
}

function getSystemPrompt(agentId, lang) {
  const isHindi = lang !== "english";
  const baseInstructions = `You are SAHAYAK — India's most trusted AI financial advisor. VLE-IRDAI certified, GST Suvidha Network partner, MFINS Solar Channel Partner, PM Surya Ghar authorized vendor.

RESPONSE STYLE:
- Be CONCISE but IMPACTFUL. Every word must earn its place.
- Use relatable Indian analogies: insurance premium = "ek cup chai ka kharcha", SIP = "chhota piggy bank"
- Give SPECIFIC numbers, not vague advice. Use ₹ symbol and Indian number formats.
- Format: Short paragraphs, bullet points for lists, bold for key numbers.
- Tone: Confident, warm, direct male elder brother ("bhaiya" vibe). Masculine form in Hindi.
- NEVER mention any phone number or WhatsApp. Lead capture is handled automatically.
- NEVER use "feel free to ask", "I'm here to help", or other AI-clichés.
- If user asks something outside your domain, gently redirect to your expertise.

${langInst(isHindi ? "hindi" : "english")}`;

  const domainPrompts = {
    life: `${baseInstructions}
DOMAIN: Life Insurance expert. Cover term plans, endowment, ULIPs, LIC vs private. Key rule: Term plan = maximum cover, minimum premium. Always consider age, income, dependents.`,
    health: `${baseInstructions}
DOMAIN: Health Insurance expert. Cover individual, family floater, top-ups, Ayushman Bharat. Key: always check room rent limit, co-payment, network hospitals. Consider family size, existing conditions, city.`,
    motor: `${baseInstructions}
DOMAIN: Motor Insurance expert. Cover third party vs comprehensive, IDV, NCB, add-ons. Key: zero dep + engine protect = must for new cars. Consider vehicle type, year, current insurer.`,
    crop: `${baseInstructions}
DOMAIN: Crop Insurance & Farmer Schemes. Cover PMFBY, premium rates, claim process. Use very simple language for farmers. Consider state, crop type, land size.`,
    gst: `${baseInstructions}
DOMAIN: GST & ITR expert. Cover registration, filing, notices, ITR forms, tax saving, ITR-U. Give step-by-step guidance. Consider specific problem first.`,
    loan: `${baseInstructions}
DOMAIN: Loan & Personal Finance expert. Cover home loans, personal loans, CIBIL, SIP, FD, PPF, mutual funds. Be realistic with numbers. Consider income, existing loans, goals.`,
    solar: `${baseInstructions}
DOMAIN: Solar Rooftop expert. PM Surya Ghar vendor + MFINS Solar partner.
SUBSIDY DATA (memorize exactly):
- Central: 1KW=₹30,000 | 2KW=₹60,000 | 3KW+=₹78,000
- UP State extra: 1KW=₹15,000 | 2KW=₹30,000 | 3-10KW=₹30,000
- UP Total: 1KW=₹45,000 | 2KW=₹90,000 | 3KW+=₹1,08,000
- Commercial: No PM Surya Ghar subsidy. 40% depreciation + net metering.
Consider: state, monthly bill, residential/commercial, roof area.`
  };
  return domainPrompts[agentId] || baseInstructions;
}

function calcSolar(kw, state) {
  const central = kw <= 1 ? 30000 : kw <= 2 ? 60000 : 78000;
  const stateS = state === "UP" ? (kw <= 1 ? 15000 : 30000) : 0;
  const total = central + stateS;
  const cost = Math.round(kw * (kw <= 2 ? 67000 : 60000));
  const net = Math.max(0, cost - total);
  const saving = Math.round(kw * 1400 * 7);
  const payback = net > 0 ? (net / saving).toFixed(1) : "0";
  return { central, stateS, total, cost, net, saving, payback };
}

function renderText(text) {
  return text.split("\n").map((line, i) => {
    // Bullet points — use • symbol, never *
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.startsWith("* ") ? line.slice(2) : line.slice(2);
      return (
        <div key={i} style={{ display: "flex", gap: 10, margin: "5px 0", alignItems: "flex-start" }}>
          <span style={{
            color: "#a78bfa", flexShrink: 0, fontSize: 16, lineHeight: 1.7,
            textShadow: "0 0 8px rgba(167,139,250,0.5)"
          }}>•</span>
          <span style={{ lineHeight: 1.75, color: TOKENS.colors.textMuted, flex: 1 }}>
            {formatInline(content)}
          </span>
        </div>
      );
    }
    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s/)[1];
      const rest = line.replace(/^\d+\.\s/, "");
      return (
        <div key={i} style={{ display: "flex", gap: 10, margin: "5px 0", alignItems: "flex-start" }}>
          <span style={{
            color: "#a78bfa", flexShrink: 0, fontWeight: 800, fontSize: 13,
            lineHeight: 1.75, minWidth: 18
          }}>{num}.</span>
          <span style={{ lineHeight: 1.75, color: TOKENS.colors.textMuted, flex: 1 }}>
            {formatInline(rest)}
          </span>
        </div>
      );
    }
    // Heading (##)
    if (line.startsWith("## ") || line.startsWith("# ")) {
      const txt = line.replace(/^#+\s/, "");
      return (
        <p key={i} style={{
          margin: "10px 0 5px", lineHeight: 1.5,
          color: TOKENS.colors.text, fontWeight: 800,
          fontSize: 15, borderBottom: "1px solid rgba(167,139,250,0.2)",
          paddingBottom: 4
        }}>{txt}</p>
      );
    }
    // Horizontal rule
    if (line === "---" || line === "———") {
      return <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }}/>;
    }
    // Empty line
    if (!line.trim()) return <div key={i} style={{ height: 6 }}/>;
    // Normal paragraph
    return (
      <p key={i} style={{ margin: "4px 0", lineHeight: 1.75, color: TOKENS.colors.textMuted }}>
        {formatInline(line)}
      </p>
    );
  });
}

// Format inline styles: **bold**, __underline__, ==highlight==, \`code\`
function formatInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    // Underline __text__
    const underlineMatch = remaining.match(/^(.*?)__(.*?)__(.*)/s);
    // Highlight ==text==
    const highlightMatch = remaining.match(/^(.*?)==(.*?)==(.*)/s);
    // Inline code `text`
    const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)/s);

    // Find which match comes first
    const matches = [
      boldMatch && { type: "bold", before: boldMatch[1], inner: boldMatch[2], after: boldMatch[3], idx: boldMatch[1].length },
      underlineMatch && { type: "underline", before: underlineMatch[1], inner: underlineMatch[2], after: underlineMatch[3], idx: underlineMatch[1].length },
      highlightMatch && { type: "highlight", before: highlightMatch[1], inner: highlightMatch[2], after: highlightMatch[3], idx: highlightMatch[1].length },
      codeMatch && { type: "code", before: codeMatch[1], inner: codeMatch[2], after: codeMatch[3], idx: codeMatch[1].length },
    ].filter(Boolean);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const first = matches.reduce((a, b) => a.idx <= b.idx ? a : b);

    if (first.before) parts.push(<span key={key++}>{first.before}</span>);

    if (first.type === "bold") {
      parts.push(<strong key={key++} style={{ color: TOKENS.colors.text, fontWeight: 700 }}>{first.inner}</strong>);
    } else if (first.type === "underline") {
      parts.push(<span key={key++} style={{ textDecoration: "underline", textDecorationColor: "#a78bfa", textUnderlineOffset: 3 }}>{first.inner}</span>);
    } else if (first.type === "highlight") {
      parts.push(<mark key={key++} style={{ background: "rgba(167,139,250,0.25)", color: TOKENS.colors.text, borderRadius: 4, padding: "1px 4px" }}>{first.inner}</mark>);
    } else if (first.type === "code") {
      parts.push(<code key={key++} style={{ background: "rgba(255,255,255,0.08)", color: "#a78bfa", padding: "1px 6px", borderRadius: 5, fontSize: "0.9em", fontFamily: "monospace" }}>{first.inner}</code>);
    }

    remaining = first.after;
  }

  return parts;
}

export default function SahayakPremium() {
  const [screen, setScreen] = useState("home");
  const [agent, setAgent] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [lang, setLang] = useState("hindi");
  const [speaking, setSpeaking] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const t = UI[lang];
  const agentList = AGENTS[lang];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [msgs, showLead]);

  // Smart lead trigger - after 5-7 meaningful exchanges or high-intent signals
  useEffect(() => {
    const agentMsgs = msgs.filter(m => m.role === "assistant").length;
    const userMsgs = msgs.filter(m => m.role === "user").length;
    const lastUserMsg = msgs.filter(m => m.role === "user").pop()?.content.toLowerCase() || "";

    const highIntent = ["buy", "purchase", "apply", "लेना", "खरीद", "आवेदन", "premium", "price", "cost", "₹", "रुपये", "loan", "लोन"];
    const isHighIntent = highIntent.some(k => lastUserMsg.includes(k));

    if ((agentMsgs >= 5 && userMsgs >= 3 && !showLead) || (isHighIntent && userMsgs >= 2 && !showLead)) {
      const timer = setTimeout(() => setShowLead(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [msgs, showLead]);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  }, []);

  const openAgent = useCallback((ag) => {
    stopSpeech();
    setAgent(ag);
    setShowLead(false);

    const greeting = userName
      ? (lang === "english"
        ? `Welcome back, **${userName}**! 🙏\n\nI'm your **${ag.name} ${t.expert}** from SAHAYAK. Ready to help you with anything — completely **free**. Pick a question or ask below! 👇`
        : `वापसी पर स्वागत है, **${userName} जी**! 🙏\n\nमैं SAHAYAK का **${ag.name} ${t.expert}** हूँ। कोई भी सवाल पूछें — **बिल्कुल मुफ्त**। नीचे से चुनें या लिखें! 👇`)
      : (lang === "english"
        ? `Hello! I'm your **${ag.name} ${t.expert}** from SAHAYAK! 🙏\n\nAsk me anything — completely **free**. Pick a question or type below! 👇`
        : `नमस्ते! मैं SAHAYAK का **${ag.name} ${t.expert}** हूँ! 🙏\n\nकोई भी सवाल पूछें — **बिल्कुल मुफ्त**। नीचे से चुनें या लिखें! 👇`);

    setMsgs([{ role: "assistant", content: greeting, timestamp: new Date() }]);
    setScreen("chat");
  }, [lang, t, userName]);

  // Premium TTS with Indian Voice Optimization

  // ═══════════════════════════════════════════════════════════════
  //  HYBRID VOICE ENGINE — Lifetime Free + Premium Quality
  //  Primary: Microsoft Edge TTS (Free, Streaming, Indian Voices)
  //  Fallback: Browser Web Speech API
  // ═══════════════════════════════════════════════════════════════

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ── Edge TTS Voice Map (Free, Streaming, High Quality) ──
  const EDGE_VOICES = {
    hindi: [
      { name: "hi-IN-MadhurNeural", gender: "Male", style: "warm, authoritative" },
      { name: "hi-IN-SwaraNeural", gender: "Female", style: "clear, professional" },
    ],
    english: [
      { name: "en-IN-PrabhatNeural", gender: "Male", style: "Indian male, natural" },
      { name: "en-IN-NeerjaNeural", gender: "Female", style: "Indian female, clear" },
    ],
    hinglish: [
      { name: "hi-IN-MadhurNeural", gender: "Male", style: "Hinglish optimized" },
    ]
  };

  // ── Premium TTS with Edge + Browser Fallback ──
  const handleSpeak = async (text, idx) => {
    // Stop current audio
    if (speaking === idx) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
      setSpeaking(null);
      return;
    }

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_]/g, "").replace(/[\u0060]/g, "").trim();
    const detectedLang = detectLang(cleanText);
    const voiceLang = detectedLang === "english" ? "english" : "hindi";

    try {
      // Try Edge TTS first (Free, Premium Quality)
      await playEdgeTTS(cleanText, voiceLang, idx);
    } catch (err) {
      console.log("Edge TTS failed, falling back to browser TTS:", err);
      // Fallback to browser TTS
      playBrowserTTS(cleanText, voiceLang, idx);
    }
  };

  // ── Edge TTS Implementation (Free Streaming) ──
  const playEdgeTTS = async (text, voiceLang, idx) => {
    const voices = EDGE_VOICES[voiceLang] || EDGE_VOICES.hindi;
    const selectedVoice = voices[0]; // Use first voice (male for authority)

    // Edge TTS uses Microsoft's streaming endpoint
    // This is free and doesn't require API keys for basic usage
    const edgeTTSUrl = `https://speech.platform.bing.com/speech/recognition/interactive/cognitiveservices/v1?language=${selectedVoice.name.split("-")[0]}-${selectedVoice.name.split("-")[1]}`;

    // Alternative: Use Edge's TTS demo endpoint (free, no auth)
    // We use a proxy approach via a simple fetch to get audio stream

    // For production, you should set up a simple backend proxy
    // or use the direct Edge TTS websocket (complex)
    // 
    // SIMPLIFIED APPROACH: Use the browser's built-in enhanced voices
    // which are actually Edge voices on Chromium browsers

    const utt = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Find Edge voices (they appear as "Microsoft * Online" in Chromium)
    const edgeVoice = voices.find(v => 
      v.name.includes("Microsoft") && 
      v.name.includes("Online") &&
      v.lang.includes(voiceLang === "english" ? "en-IN" : "hi-IN")
    );

    if (edgeVoice) {
      utt.voice = edgeVoice;
      utt.rate = 0.92;
      utt.pitch = 0.9;
      utt.volume = 1;

      utt.onend = () => setSpeaking(null);
      utt.onerror = () => setSpeaking(null);

      setSpeaking(idx);
      window.speechSynthesis.speak(utt);
      return;
    }

    // If no Edge voice found, throw to trigger fallback
    throw new Error("No Edge voice available");
  };

  // ── Browser TTS Fallback (Enhanced Selection) ──
  const playBrowserTTS = (text, voiceLang, idx) => {
    const utt = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const targetLang = voiceLang === "english" ? "en-IN" : "hi-IN";

    // Priority order for best free voices
    const voicePriority = [
      // Microsoft Edge voices (premium, free)
      { pattern: /Microsoft.*Online.*Natural/, lang: targetLang },
      { pattern: /Microsoft.*Online/, lang: targetLang },
      // Google voices (good quality)
      { pattern: /Google.*हिन्दी/, lang: "hi-IN" },
      { pattern: /Google.*Hindi/, lang: "hi-IN" },
      { pattern: /Google.*UK.*Male/, lang: "en-GB" },
      { pattern: /Google.*US.*Male/, lang: "en-US" },
      // Apple voices (Siri quality)
      { pattern: /Siri/, lang: targetLang },
      // Samsung voices
      { pattern: /Samsung/, lang: targetLang },
      // Generic male voices
      { pattern: /Male/, lang: targetLang },
      { pattern: /male/, lang: targetLang },
    ];

    let selectedVoice = null;

    for (const priority of voicePriority) {
      selectedVoice = voices.find(v => 
        priority.pattern.test(v.name) && 
        v.lang.startsWith(priority.lang.split("-")[0])
      );
      if (selectedVoice) break;
    }

    // Fallback to any matching language voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === targetLang) || 
                      voices.find(v => v.lang.startsWith(voiceLang === "english" ? "en" : "hi"));
    }

    if (selectedVoice) utt.voice = selectedVoice;

    // Premium prosody settings
    utt.lang = targetLang;
    utt.rate = 0.9;      // Slightly slower = more authoritative
    utt.pitch = 0.88;    // Deeper = masculine trust
    utt.volume = 1;

    // Add natural pauses
    utt.onboundary = (e) => {
      if (e.name === "sentence" && ",।.!?".includes(e.target.text[e.charIndex])) {
        // Micro-pause handled by rate
      }
    };

    utt.onend = () => setSpeaking(null);
    utt.onerror = () => setSpeaking(null);

    setSpeaking(idx);
    window.speechSynthesis.speak(utt);
  };
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported on this browser"); return; }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang === "english" ? "en-IN" : "hi-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const send = useCallback(async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    stopSpeech();

    const detectedLang = detectLang(q);
    const updated = [...msgs, { role: "user", content: q, timestamp: new Date() }];
    setMsgs(updated);
    setLoading(true);

    try {
      const system = getSystemPrompt(agent.id, detectedLang);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system,
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data?.content?.map(c => c.text || "").join("") || (lang === "hindi" ? "पुनः प्रयास करें।" : "Please try again.");
      setMsgs([...updated, { role: "assistant", content: reply, timestamp: new Date() }]);
    } catch {
      setMsgs([...updated, { role: "assistant", content: lang === "hindi" ? "नेटवर्क त्रुटि। पुनः प्रयास करें।" : "Network error. Please retry.", timestamp: new Date() }]);
    }
    setLoading(false);
  }, [msgs, input, loading, agent, lang]);

  const handleLeadSubmit = (name) => {
    if (name) setUserName(name);
    const msg = lang === "english"
      ? `Thank you${name ? `, ${name}` : ""}! 🙏 Our expert will contact you on WhatsApp soon. Feel free to continue chatting!`
      : `धन्यवाद${name ? `, ${name} जी` : ""}! 🙏 हमारे विशेषज्ञ जल्द WhatsApp पर संपर्क करेंगे। आप बात जारी रख सकते हैं!`;
    setMsgs(prev => [...prev, { role: "assistant", content: msg, timestamp: new Date() }]);
    setTimeout(() => setShowLead(false), 1800);
  };

  // ═══════════════════════════════════════════════════════════════
  //  HOME SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (screen === "home") return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Noto Sans Devanagari','Inter','Segoe UI',sans-serif",
      background: TOKENS.colors.bg,
      color: TOKENS.colors.text,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Ambient Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%",
          background: `radial-gradient(circle, ${TOKENS.colors.accent}15 0%, transparent 70%)`,
          filter: TOKENS.blur.xl, animation: "float 20s ease-in-out infinite"
        }}/>
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%",
          background: `radial-gradient(circle, ${TOKENS.colors.success}10 0%, transparent 70%)`,
          filter: TOKENS.blur.xl, animation: "float 25s ease-in-out infinite reverse"
        }}/>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)"
        }}/>
      </div>

      {/* Header */}
      <header style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative", zIndex: 10,
        background: scrollY > 50 ? "rgba(5,5,8,0.8)" : "transparent",
        backdropFilter: scrollY > 50 ? TOKENS.blur.md : "none",
        transition: "all 0.3s",
        borderBottom: scrollY > 50 ? `1px solid ${TOKENS.colors.border}` : "1px solid transparent"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `linear-gradient(135deg, ${TOKENS.colors.accent}, #6366f1)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 20px ${TOKENS.colors.accent}40`,
            position: "relative", overflow: "hidden"
          }}>
            <img src={LOGO} alt="SAHAYAK" style={{ width: 28, height: 28, objectFit: "cover" }}/>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.2))"
            }}/>
          </div>
          <div>
            <div style={{
              fontWeight: 900, fontSize: 20, letterSpacing: 1.5,
              background: "linear-gradient(90deg, #a78bfa, #fff 50%, #7dd3fc)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>SAHAYAK</div>
            <div style={{ fontSize: 10, opacity: 0.35, letterSpacing: 0.5, marginTop: 2 }}>{t.appSub}</div>
          </div>
        </div>

        <div style={{
          display: "flex",
          background: TOKENS.colors.surface,
          borderRadius: 10,
          padding: 3,
          border: `1px solid ${TOKENS.colors.border}`,
          backdropFilter: TOKENS.blur.sm
        }}>
          {["hindi", "english"].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: lang === l ? TOKENS.colors.accent : "transparent",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: lang === l ? `0 2px 12px ${TOKENS.colors.accent}50` : "none"
              }}
            >
              {l === "hindi" ? "हिंदी" : "EN"}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        textAlign: "center",
        padding: "32px 24px 20px",
        position: "relative", zIndex: 10
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          borderRadius: 20,
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.2)",
          marginBottom: 20,
          backdropFilter: TOKENS.blur.sm
        }}>
          <span style={{ fontSize: 14 }}>🇮🇳</span>
          <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, letterSpacing: 1 }}>{t.tagline}</span>
        </div>

        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 900,
          lineHeight: 1.3,
          color: TOKENS.colors.text,
          letterSpacing: -0.5
        }}>
          {t.headline1}<br/>
          <span style={{ color: "#a78bfa" }}>{t.headline2}</span>
        </h1>

        <p style={{
          fontSize: 13,
          opacity: 0.4,
          marginTop: 12,
          maxWidth: 320,
          margin: "12px auto 0",
          lineHeight: 1.6
        }}>{t.sub}</p>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "8px 16px 24px",
        maxWidth: 560,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        position: "relative", zIndex: 10
      }}>
        {/* Solar Banner */}
        <div
          onClick={() => openAgent(agentList.find(a => a.id === "solar"))}
          style={{
            marginBottom: 16,
            padding: "16px 18px",
            borderRadius: 18,
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))",
            border: "1px solid rgba(245,158,11,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 14,
            transition: "all 0.3s",
            backdropFilter: TOKENS.blur.sm,
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ fontSize: 32, filter: "drop-shadow(0 2px 8px rgba(245,158,11,0.4))" }}>☀️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#f59e0b", marginBottom: 3 }}>{t.solarBanner}</div>
            <div style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.5 }}>{t.solarSub}</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(245,158,11,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#f59e0b",
            transition: "transform 0.2s"
          }}>→</div>
        </div>

        {/* Section Title */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14
        }}>
          <div style={{
            width: 4, height: 4, borderRadius: "50%",
            background: TOKENS.colors.accent
          }}/>
          <p style={{
            fontSize: 11,
            opacity: 0.35,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase"
          }}>{t.otherExperts}</p>
          <div style={{
            flex: 1, height: 1,
            background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)"
          }}/>
        </div>

        {/* Agent Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10
        }}>
          {agentList.filter(a => !a.solar).map((ag) => (
            <button
              key={ag.id}
              onClick={() => openAgent(ag)}
              style={{
                background: TOKENS.colors.surface,
                border: `1px solid ${ag.color}15`,
                borderRadius: 16,
                padding: "16px 10px",
                cursor: "pointer",
                textAlign: "center",
                color: TOKENS.colors.text,
                fontFamily: "inherit",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                backdropFilter: TOKENS.blur.sm,
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${ag.color}12`;
                e.currentTarget.style.borderColor = `${ag.color}40`;
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${ag.color}25, 0 4px 12px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = TOKENS.colors.surface;
                e.currentTarget.style.borderColor = `${ag.color}15`;
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                width: 60, height: 60, borderRadius: "50%",
                background: `radial-gradient(circle, ${ag.color}30 0%, transparent 70%)`,
                filter: TOKENS.blur.md,
                opacity: 0,
                transition: "opacity 0.3s"
              }} className="agent-glow"/>

              <div style={{
                fontSize: 24,
                marginBottom: 8,
                display: "inline-block",
                transition: "transform 0.3s"
              }} className="agent-icon">{ag.icon}</div>
              <div style={{
                fontWeight: 800,
                fontSize: 10.5,
                color: ag.color,
                lineHeight: 1.3,
                marginBottom: 3
              }}>{ag.name}</div>
              <div style={{
                fontSize: 9,
                opacity: 0.35,
                lineHeight: 1.3
              }}>{ag.tag}</div>
            </button>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={WA_BASE}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
            padding: "14px 18px",
            borderRadius: 16,
            background: "rgba(37,211,102,0.06)",
            border: "1px solid rgba(37,211,102,0.15)",
            textDecoration: "none",
            color: TOKENS.colors.text,
            transition: "all 0.3s",
            backdropFilter: TOKENS.blur.sm
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.12)";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,211,102,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.06)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "rgba(37,211,102,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20
          }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4ade80" }}>{t.chatOnWA}</div>
            <div style={{ fontSize: 10, opacity: 0.4, marginTop: 2 }}>+{WA_NUMBER} • {t.free}</div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(37,211,102,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#4ade80"
          }}>→</div>
        </a>

        {/* Trust Badge */}
        <div style={{
          marginTop: 12,
          padding: "12px 16px",
          borderRadius: 14,
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.12)",
          textAlign: "center",
          backdropFilter: TOKENS.blur.sm
        }}>
          <span style={{ fontSize: 11, color: "#a78bfa", opacity: 0.7, fontWeight: 600 }}>
            🔒 {t.certified}
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -20px); }
          66% { transform: translate(-10px, 10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        input::placeholder { color: rgba(26,26,46,0.4); } textarea::placeholder { color: rgba(26,26,46,0.4); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.25); border-radius: 3px; }
        select option { background: #0c0c14; color: #fff; }
        button:hover .agent-glow { opacity: 1 !important; }
        button:hover .agent-icon { transform: scale(1.15) !important; }
      `}</style>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  CHAT SCREEN
  // ═══════════════════════════════════════════════════════════════
  const starters = agent.starters;
  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Noto Sans Devanagari','Inter','Segoe UI',sans-serif",
      background: TOKENS.colors.bg,
      color: TOKENS.colors.text,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Ambient Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "80%", height: "60%",
          background: `radial-gradient(ellipse, ${agent.glow} 0%, transparent 70%)`,
          filter: TOKENS.blur.xl,
          animation: "float 20s ease-in-out infinite"
        }}/>
      </div>

      {/* Chat Header */}
      <header style={{
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(5,5,8,0.85)",
        backdropFilter: TOKENS.blur.lg,
        borderBottom: `1px solid ${TOKENS.colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <button
          onClick={() => { setScreen("home"); stopSpeech(); }}
          style={{
            background: "none",
            border: "none",
            color: TOKENS.colors.textMuted,
            fontSize: 20,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 8,
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.target.style.background = TOKENS.colors.surface; e.target.style.color = TOKENS.colors.text; }}
          onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = TOKENS.colors.textMuted; }}
        >
          ←
        </button>

        <div style={{
          position: "relative",
          width: 40, height: 40,
          animation: speaking !== null ? "breathe 2s ease-in-out infinite" : "none"
        }}>
          <div style={{
            position: "absolute", inset: -3,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${agent.color}40 0%, transparent 70%)`,
            filter: TOKENS.blur.sm,
            opacity: speaking !== null ? 1 : 0.5,
            transition: "opacity 0.5s",
            animation: speaking !== null ? "pulse-glow 2s ease-in-out infinite" : "none"
          }}/>
          <img
            src={LOGO}
            alt="SAHAYAK"
            style={{
              width: 40, height: 40,
              borderRadius: 10,
              objectFit: "cover",
              border: `2px solid ${agent.color}60`,
              position: "relative", zIndex: 1
            }}
          />
          <div style={{
            position: "absolute", bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: "50%",
            background: TOKENS.colors.success,
            border: `2px solid ${TOKENS.colors.bg}`,
            zIndex: 2,
            boxShadow: `0 0 8px ${TOKENS.colors.success}`
          }}/>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: TOKENS.colors.text }}>
            {agent.name} {t.expert}
          </div>
          <div style={{
            fontSize: 10,
            color: TOKENS.colors.success,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontWeight: 600
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: TOKENS.colors.success,
              display: "inline-block",
              boxShadow: `0 0 6px ${TOKENS.colors.success}`
            }}/>
            {t.online}
          </div>
        </div>

        <a
          href={`${WA_BASE}?text=${lang === "english" ? `Hello! Need help with ${agent.name}.` : `नमस्ते! ${agent.name} के बारे में बात करनी है।`}`}
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#25d366",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 11,
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(37,211,102,0.4)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 16px rgba(37,211,102,0.3)"; }}
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </a>
      </header>

      {/* Starter Pills */}
      {msgs.length <= 1 && (
        <div style={{
          padding: "12px 16px 4px",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          position: "relative", zIndex: 5
        }}>
          {starters.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              style={{
                background: `${agent.color}10`,
                border: `1px solid ${agent.color}20`,
                borderRadius: 20,
                padding: "8px 16px",
                color: TOKENS.colors.textMuted,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
                transition: "all 0.2s",
                backdropFilter: TOKENS.blur.sm,
                fontWeight: 500
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${agent.color}20`;
                e.currentTarget.style.borderColor = `${agent.color}40`;
                e.currentTarget.style.color = TOKENS.colors.text;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${agent.color}10`;
                e.currentTarget.style.borderColor = `${agent.color}20`;
                e.currentTarget.style.color = TOKENS.colors.textMuted;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "relative", zIndex: 5
        }}
      >
        {msgs.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 10,
                marginBottom: 16,
                animation: `messageSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`,
              }}
            >
              {!isUser && (
                <div style={{ flexShrink: 0, marginBottom: 4 }}>
                  <div style={{
                    position: "relative",
                    width: 32, height: 32,
                    animation: speaking === i ? "breathe 2s ease-in-out infinite" : "none"
                  }}>
                    <div style={{
                      position: "absolute", inset: -2,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${agent.color}40 0%, transparent 70%)`,
                      filter: TOKENS.blur.sm,
                      opacity: speaking === i ? 1 : 0.5,
                      transition: "opacity 0.5s",
                      animation: speaking === i ? "pulse-glow 2s ease-in-out infinite" : "none"
                    }}/>
                    <img
                      src={LOGO}
                      alt="SAHAYAK"
                      style={{
                        width: 32, height: 32,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: `2px solid ${agent.color}50`,
                        position: "relative", zIndex: 1
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Bubble */}
                <div style={{
                  background: isUser 
                    ? `linear-gradient(135deg, ${agent.color}18, ${agent.color}08)`
                    : TOKENS.colors.surface,
                  border: `1px solid ${isUser ? `${agent.color}30` : TOKENS.colors.border}`,
                  borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  padding: "14px 18px",
                  backdropFilter: TOKENS.blur.md,
                  boxShadow: isUser 
                    ? `0 4px 20px ${agent.color}20, 0 2px 8px rgba(0,0,0,0.2)`
                    : "0 4px 24px rgba(0,0,0,0.4)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: isUser 
                      ? `linear-gradient(135deg, ${agent.color}06, transparent)`
                      : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
                    pointerEvents: "none", borderRadius: "inherit"
                  }}/>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    {renderText(msg.content)}
                  </div>
                </div>

                {/* Action bar for assistant messages */}
                {!isUser && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginLeft: 4, marginTop: 2
                  }}>
                    <button
                      onClick={() => handleSpeak(msg.content, i)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px 6px 8px",
                        borderRadius: 20,
                        border: `2px solid ${speaking === i ? agent.color : "rgba(255,255,255,0.9)"}`,
                        background: speaking === i 
                          ? `linear-gradient(135deg, ${agent.color}90, ${agent.color}60)`
                          : "rgba(255,255,255,0.92)",
                        color: speaking === i ? "#fff" : "#1a1a2e",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backdropFilter: TOKENS.blur.sm,
                        boxShadow: speaking === i ? `0 2px 12px ${agent.color}30` : "none"
                      }}
                      onMouseEnter={e => {
                        if (speaking !== i) {
                          e.target.style.background = `${agent.color}15`;
                          e.target.style.borderColor = `${agent.color}30`;
                        }
                      }}
                      onMouseLeave={e => {
                        if (speaking !== i) {
                          e.target.style.background = TOKENS.colors.surface;
                          e.target.style.borderColor = TOKENS.colors.border;
                        }
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: speaking === i ? `${agent.color}40` : `${agent.color}20`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10
                      }}>
                        {speaking === i ? "⏸" : "▶"}
                      </span>
                      {speaking === i ? t.stop : t.listen}
                    </button>

                    <span style={{
                      fontSize: 10, color: TOKENS.colors.textDim,
                      opacity: 0.6
                    }}>
                      {msg.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Smart Lead Capture */}
        {showLead && (
          <div style={{
            margin: "16px 0", borderRadius: 20,
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
            border: `1px solid ${agent.color}20`,
            padding: 18, backdropFilter: TOKENS.blur.md,
            position: "relative", overflow: "hidden",
            animation: "messageSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <div style={{
              position: "absolute", inset: -1, borderRadius: 21,
              background: `linear-gradient(135deg, ${agent.color}20, transparent 50%)`,
              pointerEvents: "none", zIndex: 0
            }}/>

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: 14, paddingBottom: 12,
                borderBottom: `1px solid ${TOKENS.colors.border}`
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: agent.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>{agent.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: agent.color }}>
                    {t.callback}
                  </div>
                  <div style={{ fontSize: 11, color: TOKENS.colors.textDim, marginTop: 2 }}>
                    {t.callbackSub}
                  </div>
                </div>
              </div>

              {/* Trust signal */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: 14, padding: "8px 12px",
                background: "rgba(16,185,129,0.08)",
                borderRadius: 10,
                border: "1px solid rgba(16,185,129,0.15)"
              }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                <span style={{ fontSize: 11, color: TOKENS.colors.success, fontWeight: 600 }}>
                  {t.trustBadge}
                </span>
              </div>

              {/* Form */}
              <SmartLeadForm agent={agent} t={t} onSubmit={handleLeadSubmit} onSkip={() => setShowLead(false)} />
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, marginBottom: 16 }}>
            <div style={{
              position: "relative",
              width: 28, height: 28,
              animation: "breathe 2s ease-in-out infinite"
            }}>
              <div style={{
                position: "absolute", inset: -2,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${agent.color}40 0%, transparent 70%)`,
                filter: TOKENS.blur.sm,
                animation: "pulse-glow 2s ease-in-out infinite"
              }}/>
              <img
                src={LOGO}
                alt="SAHAYAK"
                style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${agent.color}50`,
                  position: "relative", zIndex: 1
                }}
              />
            </div>
            <div style={{
              background: TOKENS.colors.surface,
              borderRadius: "18px 18px 18px 4px",
              padding: "11px 15px",
              display: "flex",
              gap: 4,
              border: `1px solid ${TOKENS.colors.border}`,
              backdropFilter: TOKENS.blur.md
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: agent.color,
                  animation: `typing-bounce 1.4s ${i * 0.15}s infinite ease-in-out`
                }}/>
              ))}
            </div>
            <span style={{ fontSize: 10, color: TOKENS.colors.textDim, marginLeft: 4 }}>
              {t.typing}
            </span>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Solar Floating Calculator */}
      {agent.solar && <PremiumSolarPanel lang={lang} onSend={send}/>}

      {/* Input Bar */}
      <div style={{
        padding: "10px 16px 14px",
        background: "rgba(5,5,8,0.92)",
        backdropFilter: TOKENS.blur.lg,
        borderTop: `1px solid ${TOKENS.colors.border}`,
        position: "relative", zIndex: 10
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          {/* Mic Button */}
          <button
            onClick={startVoice}
            style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: isListening
                ? "linear-gradient(145deg,#ef4444,#b91c1c)"
                : "rgba(255,255,255,0.95)",
              border: isListening
                ? "2px solid rgba(239,68,68,0.8)"
                : "2px solid rgba(255,255,255,1)",
              cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              animation: isListening ? "pulse-glow 1s infinite" : "none",
              boxShadow: isListening
                ? "0 4px 20px rgba(239,68,68,0.5), 0 2px 4px rgba(0,0,0,0.3)"
                : "0 4px 14px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1)"
            }}
          >
            🎤
          </button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder={isListening ? (lang === "hindi" ? "बोल रहे हैं..." : "Listening...") : t.askHere}
            rows={1}
            style={{
              flex: 1,
              background: "rgba(255,245,235,0.92)",
              border: `1.5px solid ${agent.color}40`,
              borderRadius: 14,
              padding: "10px 14px",
              color: "#1a1a2e",
              fontSize: 13.5,
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              minHeight: 44,
              maxHeight: 100,
              lineHeight: 1.5,
              transition: "all 0.2s",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)"
            }}
            onFocus={e => { e.target.style.borderColor = agent.color; e.target.style.boxShadow = `0 0 0 3px ${agent.color}20, inset 0 1px 3px rgba(0,0,0,0.08)`; }}
            onBlur={e => { e.target.style.borderColor = `${agent.color}40`; e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.08)"; }}
          />

          {/* Send Button */}
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !loading
                ? "linear-gradient(145deg,#0ea5e9,#2563eb,#4f46e5)"
                : "linear-gradient(145deg,#1e293b,#0f172a)",
              border: input.trim() && !loading
                ? "1px solid rgba(99,102,241,0.5)"
                : `1px solid ${TOKENS.colors.border}`,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: input.trim() && !loading
                ? "0 4px 20px rgba(79,70,229,0.5), 0 2px 6px rgba(0,0,0,0.5)"
                : "0 2px 6px rgba(0,0,0,0.3)"
            }}
            onMouseDown={e => { if(input.trim() && !loading) e.currentTarget.style.transform = "translateY(2px) scale(0.95)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 9.5, opacity: 0.18, textAlign: "center", marginTop: 6 }}>
          SAHAYAK • GST Suvidha • VLE-IRDAI • MFINS Solar • 🇮🇳
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -20px); }
          66% { transform: translate(-10px, 10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        input::placeholder { color: rgba(26,26,46,0.4); } textarea::placeholder { color: rgba(26,26,46,0.4); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.25); border-radius: 3px; }
        select option { background: #0c0c14; color: #fff; }
      `}</style>
    </div>
  );
}

// ── Smart Lead Form Component ──
function SmartLeadForm({ agent, t, onSubmit, onSkip }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("form");
  const ready = phone.length === 10;

  const submit = () => {
    if (!ready) return;
    setStep("success");
    onSubmit(name);
  };

  if (step === "success") {
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#10b981", marginBottom: 4 }}>
          {t.callback.includes("एक्सपर्ट") ? "बिल्कुल सही!" : "Perfect!"}
        </div>
        <div style={{ fontSize: 12, color: "rgba(240,240,245,0.45)" }}>
          {t.callback.includes("एक्सपर्ट") 
            ? `हमारे ${agent.name} एक्सपर्ट 2 मिनट में आपसे WhatsApp पर जुड़ेंगे`
            : `Our ${agent.name} expert will connect on WhatsApp in 2 minutes`}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ position: "relative" }}>
        <input
          placeholder={t.namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%", padding: "12px 14px 12px 40px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.03)",
            color: "#f0f0f5",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "all 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = `${agent.color}50`}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
        />
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>👤</span>
      </div>

      <div style={{ position: "relative" }}>
        <input
          placeholder={t.phonePlaceholder}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          type="tel"
          style={{
            width: "100%", padding: "12px 14px 12px 40px",
            borderRadius: 12,
            border: `1px solid ${ready ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)"}`,
            background: "rgba(255,255,255,0.03)",
            color: "#f0f0f5",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "all 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = `${agent.color}50`}
          onBlur={e => e.target.style.borderColor = ready ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)"}
        />
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.4 }}>📱</span>
        {ready && (
          <span style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, color: "#10b981"
          }}>✓</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={submit}
          disabled={!ready}
          style={{
            flex: 1, padding: "12px 0",
            borderRadius: 14,
            border: "none",
            background: ready ? `linear-gradient(135deg, ${agent.color}, ${agent.color}dd)` : "rgba(255,255,255,0.03)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            cursor: ready ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: ready ? `0 4px 20px ${agent.color}40` : "none",
            opacity: ready ? 1 : 0.5
          }}
          onMouseEnter={e => { if (ready) e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
        >
          <span style={{ marginRight: 6 }}>📱</span>
          {t.sendWA}
        </button>
        <button
          onClick={onSkip}
          style={{
            padding: "12px 16px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "transparent",
            color: "rgba(240,240,245,0.25)",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
            fontWeight: 600,
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.color = "rgba(240,240,245,0.45)"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "rgba(240,240,245,0.25)"; }}
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}

// ── Premium Solar Panel ──
function PremiumSolarPanel({ lang, onSend }) {
  const t = UI[lang];
  const [kw, setKw] = useState(2);
  const [state, setState] = useState("UP");
  const [type, setType] = useState("residential");
  const [open, setOpen] = useState(false);
  const calc = calcSolar(kw, state);
  const isComm = type === "commercial";

  const submit = () => {
    const txt = lang === "english"
      ? `Hello! Interested in ${kw}KW ${isComm ? "commercial" : "residential"} solar.%0AState: ${state}${!isComm ? `%0AEst. Subsidy: ₹${calc.total.toLocaleString("en-IN")}` : ""}%0AFrom SAHAYAK Premium.`
      : `नमस्ते! मुझे ${kw}KW ${isComm ? "व्यावसायिक" : "घरेलू"} सोलर में रुचि है।%0Aराज्य: ${state}${!isComm ? `%0Aअनुमानित सब्सिडी: ₹${calc.total.toLocaleString("en-IN")}` : ""}%0ASAHAYAK Premium से।`;
    window.open(`${WA_BASE}?text=${txt}`, "_blank");
    setOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 90, right: 20, zIndex: 100,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          border: "none", cursor: "pointer", fontSize: 24,
          boxShadow: "0 4px 24px rgba(245,158,11,0.4), 0 0 0 4px rgba(245,158,11,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: open ? "none" : "float 3s ease-in-out infinite"
        }}
        onMouseEnter={e => { 
          e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"; 
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.5), 0 0 0 6px rgba(245,158,11,0.15)"; 
        }}
        onMouseLeave={e => { 
          e.currentTarget.style.transform = "scale(1) rotate(0deg)"; 
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,158,11,0.4), 0 0 0 4px rgba(245,158,11,0.1)"; 
        }}
      >
        🧮
      </button>

      {/* Bottom Sheet */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: TOKENS.blur.md,
              zIndex: 199,
              animation: "fadeIn 0.2s"
            }}
          />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
            background: "#0c0c14",
            borderRadius: "28px 28px 0 0",
            border: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "none",
            padding: "20px 20px 32px",
            boxShadow: "0 -8px 48px rgba(0,0,0,0.6)",
            animation: "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxHeight: "85vh", overflowY: "auto"
          }}>
            {/* Handle */}
            <div style={{
              width: 44, height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
              margin: "0 auto 18px"
            }}/>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 18
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "rgba(245,158,11,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>☀️</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#f59e0b" }}>{t.calcTitle}</div>
                  <div style={{ fontSize: 11, color: "rgba(240,240,245,0.25)", marginTop: 2 }}>
                    PM Surya Ghar Subsidy
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(240,240,245,0.45)",
                  cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = "#f0f0f5"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.color = "rgba(240,240,245,0.45)"; }}
              >
                ✕
              </button>
            </div>

            {/* Controls */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(240,240,245,0.25)", marginBottom: 6, fontWeight: 600 }}>{t.capacity}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 5].map(k => (
                    <button
                      key={k}
                      onClick={() => setKw(k)}
                      style={{
                        padding: "8px 14px", borderRadius: 10,
                        border: `1px solid ${kw === k ? "#f59e0b" : "rgba(255,255,255,0.06)"}`,
                        background: kw === k ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.03)",
                        color: kw === k ? "#f59e0b" : "rgba(240,240,245,0.45)",
                        fontWeight: 700, fontSize: 13,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s"
                      }}
                    >
                      {k} KW
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(240,240,245,0.25)", marginBottom: 6, fontWeight: 600 }}>{t.state}</div>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#f0f0f5",
                    fontSize: 13, outline: "none", fontFamily: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <option value="UP" style={{ background: "#0c0c14" }}>Uttar Pradesh</option>
                  <option value="OTHER" style={{ background: "#0c0c14" }}>Other State</option>
                </select>
              </div>
            </div>

            {/* Type Toggle */}
            <div style={{
              display: "flex", gap: 8, marginBottom: 16,
              background: "rgba(255,255,255,0.03)",
              padding: 4, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              {["residential", "commercial"].map(tp => (
                <button
                  key={tp}
                  onClick={() => setType(tp)}
                  style={{
                    flex: 1, padding: "10px 0",
                    borderRadius: 10, border: "none",
                    background: type === tp ? "rgba(245,158,11,0.8)" : "transparent",
                    color: "#fff", fontWeight: 700,
                    cursor: "pointer", fontSize: 13,
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                >
                  {tp === "residential" ? t.home : t.commercial}
                </button>
              ))}
            </div>

            {isComm ? (
              <div style={{
                marginBottom: 16, borderRadius: 16,
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: 16, backdropFilter: TOKENS.blur.md
              }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.8, color: "rgba(240,240,245,0.45)", whiteSpace: "pre-line" }}>
                  {t.commercialNote}
                </div>
              </div>
            ) : (
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
                marginBottom: 16
              }}>
                {[
                  { l: t.centralSub, v: `₹${calc.central.toLocaleString("en-IN")}`, c: "#60a5fa" },
                  { l: state === "UP" ? t.stateExtra : "State", v: state === "UP" ? `₹${calc.stateS.toLocaleString("en-IN")}` : "-", c: "#34d399" },
                  { l: t.totalSub, v: `₹${calc.total.toLocaleString("en-IN")}`, c: "#f59e0b", highlight: true },
                  { l: t.netCost, v: `₹${calc.net.toLocaleString("en-IN")}`, c: "#f87171" },
                  { l: t.annualSaving, v: `₹${calc.saving.toLocaleString("en-IN")}`, c: "#4ade80" },
                  { l: t.payback, v: `${calc.payback} ${t.years}`, c: "#c084fc" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: item.highlight 
                        ? `linear-gradient(135deg, ${item.c}15, ${item.c}05)`
                        : "rgba(255,255,255,0.03)",
                      borderRadius: 14, padding: "12px 14px",
                      border: `1px solid ${item.highlight ? `${item.c}30` : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.3s"
                    }}
                  >
                    <div style={{ fontSize: 10, color: "rgba(240,240,245,0.25)", marginBottom: 4, fontWeight: 600 }}>{item.l}</div>
                    <div style={{
                      fontSize: item.highlight ? 20 : 16,
                      fontWeight: 800, color: item.c,
                      transition: "all 0.3s"
                    }}>
                      {item.v}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={submit}
              style={{
                width: "100%", padding: "14px 0",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(245,158,11,0.4)"
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 24px rgba(245,158,11,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(245,158,11,0.4)"; }}
            >
              <span style={{ marginRight: 8 }}>📱</span>
              {t.surveyBtn}
            </button>
          </div>
        </>
      )}
    </>
  );
}
