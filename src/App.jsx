import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const LOGO = "/logo.svg?v=3";
const WA_NUMBER = "918115776644";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

// ═══════════════════════════════════════════════════════════
// PREMIUM DESIGN TOKENS — World-Class Luxury Fintech
// ═══════════════════════════════════════════════════════════
const TOKENS = {
  colors: {
    bg: "#030305",
    bgElevated: "#0a0a0f",
    surface: "rgba(255,255,255,0.025)",
    surfaceHover: "rgba(255,255,255,0.06)",
    surfaceActive: "rgba(255,255,255,0.09)",
    border: "rgba(255,255,255,0.04)",
    borderHover: "rgba(255,255,255,0.10)",
    borderActive: "rgba(255,255,255,0.18)",
    text: "#f8f8ff",
    textMuted: "rgba(248,248,255,0.50)",
    textDim: "rgba(248,248,255,0.22)",
    textGhost: "rgba(248,248,255,0.10)",
    accent: { primary: "#a855f7", secondary: "#6366f1", tertiary: "#06b6d4", quaternary: "#f59e0b" },
    holographic: "linear-gradient(135deg, #a855f7, #6366f1, #06b6d4, #f59e0b)",
    glow: { purple: "rgba(168,85,247,0.35)", blue: "rgba(99,102,241,0.30)", cyan: "rgba(6,182,212,0.25)", amber: "rgba(245,158,11,0.30)", green: "rgba(16,185,129,0.30)" },
    success: "#22c55e", warning: "#f59e0b", danger: "#ef4444", info: "#3b82f6",
  },
  blur: { xs: "blur(4px)", sm: "blur(8px)", md: "blur(16px)", lg: "blur(24px)", xl: "blur(40px)", xxl: "blur(80px)" },
  shadows: {
    sm: "0 2px 8px rgba(0,0,0,0.3)", md: "0 4px 16px rgba(0,0,0,0.4)", lg: "0 8px 32px rgba(0,0,0,0.5)", xl: "0 16px 48px rgba(0,0,0,0.6)",
    glow: { purple: "0 0 40px rgba(168,85,247,0.4)", blue: "0 0 40px rgba(99,102,241,0.4)", cyan: "0 0 40px rgba(6,182,212,0.4)" },
  },
  transitions: { fast: "all 0.15s cubic-bezier(0.4,0,0.2,1)", normal: "all 0.3s cubic-bezier(0.4,0,0.2,1)", slow: "all 0.5s cubic-bezier(0.4,0,0.2,1)", spring: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)", bounce: "all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)" },
  fonts: { primary: "'Noto Sans Devanagari','Inter','SF Pro Display',-apple-system,sans-serif", display: "'Inter','SF Pro Display',-apple-system,sans-serif", mono: "'JetBrains Mono','Fira Code',monospace" },
  radii: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 },
};

// ═══════════════════════════════════════════════════════════
// LUXURY UI TEXT — Bilingual Excellence
// ═══════════════════════════════════════════════════════════
const UI = {
  hindi: {
    appSub: "GST Suvidha • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 बीमा • टैक्स • सोलर — एक ही जगह",
    headline1: "हर वित्तीय समस्या का",
    headline2: "सरल समाधान",
    sub: "बिल्कुल मुफ्त • हिंदी और English • पूरे भारत में",
    solarBanner: "PM सूर्य घर — अभी चेक करें!",
    solarSub: "UP में ₹1,08,000 तक सब्सिडी • मुफ्त सर्वे",
    otherExperts: "अपने विशेषज्ञ चुनें",
    chatOnWA: "सीधे WhatsApp पर बात करें",
    free: "निःशुल्क",
    certified: "सुरक्षित • VLE-IRDAI प्रमाणित • MFINS Solar",
    online: "ऑनलाइन • निःशुल्क",
    expert: "विशेषज्ञ",
    askHere: "अपना सवाल लिखें... (हिंदी या English में)",
    listen: "सुनें", stop: "रोकें",
    callback: "🎯 एक्सपर्ट से बात करें!",
    callbackSub: "हमारे विशेषज्ञ 2 मिनट में WhatsApp पर जवाब देंगे",
    namePlaceholder: "आपका नाम",
    phonePlaceholder: "मोबाइल नंबर (10 अंक)",
    sendWA: "WhatsApp पर भेजें", later: "बाद में",
    calcTitle: "सब्सिडी कैलकुलेटर",
    capacity: "क्षमता (KW)", state: "राज्य",
    home: "🏠 घर", commercial: "🏭 व्यावसायिक",
    centralSub: "केंद्र सब्सिडी", stateExtra: "UP अतिरिक्त",
    totalSub: "कुल सब्सिडी", netCost: "अनुमानित लागत",
    annualSaving: "सालाना बचत", payback: "वापसी अवधि", years: "साल",
    surveyBtn: "मुफ्त सर्वे के लिए WhatsApp करें",
    commercialNote: "व्यावसायिक सोलर पर PM सूर्य घर सब्सिडी नहीं मिलती।\n• 40% त्वरित मूल्यह्रास लाभ\n• नेट मीटरिंग से बिजली बेचें\n• 5-7 साल में ROI",
    voiceStart: "बोलें...", voiceStop: "रुकें",
    typing: "सोच रहा हूँ...",
    trustBadge: "🔒 100% सुरक्षित • कोई स्पैम नहीं",
    welcomeBack: "वापसी पर स्वागत है",
    greeting: "नमस्ते",
    yourExpert: "आपका विशेषज्ञ",
    readyToHelp: "मदद के लिए तैयार",
    pickQuestion: "एक सवाल चुनें या लिखें",
    holdToSpeak: "दबाकर रखें — बोलें — छोड़ें",
    voiceNotSupported: "यह browser voice support नहीं करता। Chrome use करें।",
    fileTooLarge: "❌ फ़ाइल 10MB से बड़ी है!",
    docUploaded: "दस्तावेज़ अपलोड",
    typeQuestion: "अपना सवाल लिखें और Send करें",
    networkError: "नेटवर्क त्रुटि। पुनः प्रयास करें।",
    retry: "पुनः प्रयास करें",
    thankYou: "धन्यवाद",
    expertWillContact: "हमारे विशेषज्ञ जल्द WhatsApp पर संपर्क करेंगे",
    continueChat: "आप बात जारी रख सकते हैं",
    about: "SAHAYAK के बारे में",
    founder: "संस्थापक",
    contact: "संपर्क",
    certifications: "प्रमाणन",
    mission: "हमारा मिशन",
    followInstagram: "Instagram पर फॉलो करें",
    version: "संस्करण 3.0 Ultra",
    madeInIndia: "भारत में बनाया गया 🇮🇳",
  },
  english: {
    appSub: "GST Suvidha • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 INSURANCE • TAX • SOLAR — ONE PLATFORM",
    headline1: "Simple answers to every",
    headline2: "financial question",
    sub: "100% Free • Hindi & English • Pan-India",
    solarBanner: "PM Surya Ghar — Check Now!",
    solarSub: "UP subsidy upto ₹1,08,000 • Free Site Survey",
    otherExperts: "Choose your expert",
    chatOnWA: "Chat directly on WhatsApp",
    free: "Free",
    certified: "Secure • VLE-IRDAI Certified • MFINS Solar",
    online: "Online • Free",
    expert: "Expert",
    askHere: "Ask your question... (Hindi or English)",
    listen: "Listen", stop: "Stop",
    callback: "🎯 Talk to an Expert!",
    callbackSub: "Our expert will reply on WhatsApp in 2 minutes",
    namePlaceholder: "Your name",
    phonePlaceholder: "Mobile number (10 digits)",
    sendWA: "Send on WhatsApp", later: "Later",
    calcTitle: "Subsidy Calculator",
    capacity: "Capacity (KW)", state: "State",
    home: "🏠 Home", commercial: "🏭 Commercial",
    centralSub: "Central Subsidy", stateExtra: "UP Extra",
    totalSub: "Total Subsidy", netCost: "Net Cost",
    annualSaving: "Annual Saving", payback: "Payback", years: "yrs",
    surveyBtn: "WhatsApp for Free Site Survey",
    commercialNote: "No PM Surya Ghar subsidy for commercial.\n• 40% accelerated depreciation\n• Net metering benefit\n• ROI in 5-7 years",
    voiceStart: "Speak...", voiceStop: "Stop",
    typing: "Thinking...",
    trustBadge: "🔒 100% Secure • No Spam Ever",
    welcomeBack: "Welcome back",
    greeting: "Hello",
    yourExpert: "Your Expert",
    readyToHelp: "Ready to help",
    pickQuestion: "Pick a question or type below",
    holdToSpeak: "Hold to speak — Release to send",
    voiceNotSupported: "Voice not supported. Please use Chrome.",
    fileTooLarge: "❌ File too large! Max 10MB.",
    docUploaded: "Document uploaded",
    typeQuestion: "Type your question and press Send",
    networkError: "Network error. Please retry.",
    retry: "Retry",
    thankYou: "Thank you",
    expertWillContact: "Our expert will contact you on WhatsApp soon",
    continueChat: "Feel free to continue chatting",
    about: "About SAHAYAK",
    founder: "Founder",
    contact: "Contact",
    certifications: "Certifications",
    mission: "Our Mission",
    followInstagram: "Follow on Instagram",
    version: "Version 3.0 Ultra",
    madeInIndia: "Made with ❤️ in India 🇮🇳",
  }
};

// ═══════════════════════════════════════════════════════════
// AGENT CONFIGURATION — Premium Card System
// ═══════════════════════════════════════════════════════════
const AGENTS = {
  hindi: [
    { id:"life", icon:"🛡️", name:"जीवन बीमा", tag:"परिवार का भविष्य सुरक्षित", color:"#ef4444", glow:"rgba(239,68,68,0.35)", grad:"135deg,#ef4444,#991b1b", iconBg:"rgba(239,68,68,0.12)",
      starters:["मुझे कितने का बीमा लेना चाहिए?","टर्म प्लान क्या होता है?","LIC और प्राइवेट में फर्क?"],
      description: "जीवन बीमा विशेषज्ञ — आपके परिवार की सुरक्षा हमारी प्राथमिकता" },
    { id:"health", icon:"🏥", name:"स्वास्थ्य बीमा", tag:"बीमारी का खर्च, बीमा उठाएगा", color:"#10b981", glow:"rgba(16,185,129,0.35)", grad:"135deg,#10b981,#065f46", iconBg:"rgba(16,185,129,0.12)",
      starters:["फैमिली फ्लोटर क्या होता है?","आयुष्मान भारत मिलेगा?","पहले से बीमारी कवर होती है?"],
      description: "स्वास्थ्य बीमा विशेषज्ञ — बेहतर स्वास्थ्य, बेहतर जीवन" },
    { id:"motor", icon:"🚗", name:"मोटर बीमा", tag:"गाड़ी सुरक्षित, मन शांत", color:"#3b82f6", glow:"rgba(59,130,246,0.35)", grad:"135deg,#3b82f6,#1e40af", iconBg:"rgba(59,130,246,0.12)",
      starters:["थर्ड पार्टी और कॉम्प्रिहेंसिव में फर्क?","NCB कैसे बचाएं?","ज़ीरो डेप्रिसिएशन लेना चाहिए?"],
      description: "मोटर बीमा विशेषज्ञ — आपकी गाड़ी, हमारी जिम्मेदारी" },
    { id:"crop", icon:"🌾", name:"फसल बीमा", tag:"फसल की सुरक्षा — किसान का अधिकार", color:"#f59e0b", glow:"rgba(245,158,11,0.35)", grad:"135deg,#f59e0b,#92400e", iconBg:"rgba(245,158,11,0.12)",
      starters:["PMFBY में कैसे आवेदन करें?","प्रीमियम कितना लगेगा?","दावा कैसे मिलेगा?"],
      description: "फसल बीमा विशेषज्ञ — किसानों की सुरक्षा, देश की तरक्की" },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"टैक्स की टेंशन खत्म", color:"#8b5cf6", glow:"rgba(139,92,246,0.35)", grad:"135deg,#8b5cf6,#5b21b6", iconBg:"rgba(139,92,246,0.12)",
      starters:["GST नोटिस आया — क्या करूं?","कौन सा ITR फॉर्म भरें?","टैक्स कैसे बचाएं?"],
      description: "GST & ITR विशेषज्ञ — टैक्स की टेंशन, अब पूरी तरह खत्म" },
    { id:"loan", icon:"💎", name:"लोन & निवेश", tag:"सही लोन, सही निवेश — आपका हक", color:"#14b8a6", glow:"rgba(20,184,166,0.35)", grad:"135deg,#14b8a6,#0f766e", iconBg:"rgba(20,184,166,0.12)",
      starters:["होम लोन मिलेगा?","CIBIL स्कोर कैसे बढ़ाएं?","₹5000/माह कहाँ निवेश करें?"],
      description: "लोन & निवेश विशेषज्ञ — सही वित्तीय निर्णय, सुरक्षित भविष्य" },
    { id:"solar", icon:"☀️", name:"सोलर रूफटॉप", tag:"मुफ्त बिजली, सरकारी सब्सिडी", color:"#f97316", glow:"rgba(249,115,22,0.40)", grad:"135deg,#f97316,#c2410c", iconBg:"rgba(249,115,22,0.12)", solar:true,
      starters:["UP में कितनी सब्सिडी मिलेगी?","3KW सोलर का खर्च?","EMI पर सोलर मिलेगा?"],
      description: "सोलर रूफटॉप विशेषज्ञ — PM सूर्य घर योजना के तहत सब्सिडी" },
  ],
  english: [
    { id:"life", icon:"🛡️", name:"Life Insurance", tag:"Secure your family's future", color:"#ef4444", glow:"rgba(239,68,68,0.35)", grad:"135deg,#ef4444,#991b1b", iconBg:"rgba(239,68,68,0.12)",
      starters:["How much life cover do I need?","What is a term plan?","LIC vs private insurance?"],
      description: "Life Insurance Expert — Your family's security is our priority" },
    { id:"health", icon:"🏥", name:"Health Insurance", tag:"Your health, our priority", color:"#10b981", glow:"rgba(16,185,129,0.35)", grad:"135deg,#10b981,#065f46", iconBg:"rgba(16,185,129,0.12)",
      starters:["What is a family floater?","Am I eligible for Ayushman Bharat?","Are pre-existing diseases covered?"],
      description: "Health Insurance Expert — Better health, better life" },
    { id:"motor", icon:"🚗", name:"Motor Insurance", tag:"Drive safe, stay covered", color:"#3b82f6", glow:"rgba(59,130,246,0.35)", grad:"135deg,#3b82f6,#1e40af", iconBg:"rgba(59,130,246,0.12)",
      starters:["Third party vs comprehensive?","How to protect my NCB?","Is zero depreciation worth it?"],
      description: "Motor Insurance Expert — Your vehicle, our responsibility" },
    { id:"crop", icon:"🌾", name:"Crop Insurance", tag:"Farmer's right — crop protection", color:"#f59e0b", glow:"rgba(245,158,11,0.35)", grad:"135deg,#f59e0b,#92400e", iconBg:"rgba(245,158,11,0.12)",
      starters:["How to apply for PMFBY?","What is the premium amount?","How to file a crop damage claim?"],
      description: "Crop Insurance Expert — Farmer's security, nation's progress" },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"No more tax tension", color:"#8b5cf6", glow:"rgba(139,92,246,0.35)", grad:"135deg,#8b5cf6,#5b21b6", iconBg:"rgba(139,92,246,0.12)",
      starters:["Got a GST notice — what to do?","Which ITR form to file?","How to save maximum tax?"],
      description: "GST & ITR Expert — Tax tension, completely eliminated" },
    { id:"loan", icon:"💎", name:"Loan & Finance", tag:"Right loan, right investment", color:"#14b8a6", glow:"rgba(20,184,166,0.35)", grad:"135deg,#14b8a6,#0f766e", iconBg:"rgba(20,184,166,0.12)",
      starters:["Will I get a home loan?","How to improve CIBIL score?","Where to invest ₹5000/month?"],
      description: "Loan & Finance Expert — Right financial decisions, secure future" },
    { id:"solar", icon:"☀️", name:"Solar Rooftop", tag:"Free electricity, govt subsidy", color:"#f97316", glow:"rgba(249,115,22,0.40)", grad:"135deg,#f97316,#c2410c", iconBg:"rgba(249,115,22,0.12)", solar:true,
      starters:["How much subsidy in UP?","Cost of 3KW solar?","Solar on EMI?"],
      description: "Solar Rooftop Expert — Subsidy under PM Surya Ghar scheme" },
    { id:"solarquote", icon:"🧾", name:"Solar Quotation", tag:"MFINS Partner — Free Quotation", color:"#00b894", glow:"rgba(0,184,148,0.3)", grad:"135deg,#00b894,#00796b", iconBg:"rgba(0,184,148,0.1)", solarQuote:true,
      starters:["Get free solar quotation","Share your electricity bill","Ongrid vs Hybrid?"],
      description:"HAANS Solar — MFINS Partner solar quotation" },
  ]
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════
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
  const baseInstructions = `You are SAHAYAK — India's most trusted AI financial advisor. VLE-IRDAI certified, GST Suvidha Network partner, MFINS Solar Channel Partner, PM Surya Ghar authorized vendor.\n\nRESPONSE STYLE:\n- Be CONCISE but IMPACTFUL. Every word must earn its place.\n- Use relatable Indian analogies: insurance premium = "ek cup chai ka kharcha", SIP = "chhota piggy bank"\n- Give SPECIFIC numbers, not vague advice. Use ₹ symbol and Indian number formats.\n- Format: Short paragraphs, bullet points for lists, bold for key numbers.\n- Tone: Confident, warm, direct male elder brother ("bhaiya" vibe). Masculine form in Hindi.\n- NEVER mention any phone number or WhatsApp. Lead capture is handled automatically.\n- NEVER use "feel free to ask", "I'm here to help", or other AI-clichés.\n- If user asks something outside your domain, gently redirect to your expertise.\n\n${langInst(isHindi ? "hindi" : "english")}`;

  const domainPrompts = {
    life: `${baseInstructions}\nDOMAIN: Life Insurance expert. Cover term plans, endowment, ULIPs, LIC vs private. Key rule: Term plan = maximum cover, minimum premium. Always consider age, income, dependents.`,
    health: `${baseInstructions}\nDOMAIN: Health Insurance expert. Cover individual, family floater, top-ups, Ayushman Bharat. Key: always check room rent limit, co-payment, network hospitals. Consider family size, existing conditions, city.`,
    motor: `${baseInstructions}\nDOMAIN: Motor Insurance expert. Cover third party vs comprehensive, IDV, NCB, add-ons. Key: zero dep + engine protect = must for new cars. Consider vehicle type, year, current insurer.`,
    crop: `${baseInstructions}\nDOMAIN: Crop Insurance & Farmer Schemes. Cover PMFBY, premium rates, claim process. Use very simple language for farmers. Consider state, crop type, land size.`,
    gst: `${baseInstructions}\nDOMAIN: GST & ITR expert. Cover registration, filing, notices, ITR forms, tax saving, ITR-U. Give step-by-step guidance. Consider specific problem first.`,
    loan: `${baseInstructions}\nDOMAIN: Loan & Personal Finance expert. Cover home loans, personal loans, CIBIL, SIP, FD, PPF, mutual funds. Be realistic with numbers. Consider income, existing loans, goals.`,
    solar: `${baseInstructions}\nDOMAIN: Solar Rooftop expert. PM Surya Ghar vendor + MFINS Solar partner.\nSUBSIDY DATA (memorize exactly):\n- Central: 1KW=₹30,000 | 2KW=₹60,000 | 3KW+=₹78,000\n- UP State extra: 1KW=₹15,000 | 2KW=₹30,000 | 3-10KW=₹30,000\n- UP Total: 1KW=₹45,000 | 2KW=₹90,000 | 3KW+=₹1,08,000\n- Commercial: No PM Surya Ghar subsidy. 40% depreciation + net metering.\nConsider: state, monthly bill, residential/commercial, roof area.`
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

// ═══════════════════════════════════════════════════════════
// PREMIUM TEXT RENDERING ENGINE
// ═══════════════════════════════════════════════════════════
function formatInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    const underlineMatch = remaining.match(/^(.*?)__(.*?)__(.*)/s);
    const highlightMatch = remaining.match(/^(.*?)==(.*?)==(.*)/s);
    const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)/s);
    const strikethroughMatch = remaining.match(/^(.*?)~~(.*?)~~(.*)/s);
    const italicMatch = remaining.match(/^(.*?)\*(.*?)\*(.*)/s);

    const matches = [
      boldMatch && { type: "bold", before: boldMatch[1], inner: boldMatch[2], after: boldMatch[3], idx: boldMatch[1].length },
      underlineMatch && { type: "underline", before: underlineMatch[1], inner: underlineMatch[2], after: underlineMatch[3], idx: underlineMatch[1].length },
      highlightMatch && { type: "highlight", before: highlightMatch[1], inner: highlightMatch[2], after: highlightMatch[3], idx: highlightMatch[1].length },
      codeMatch && { type: "code", before: codeMatch[1], inner: codeMatch[2], after: codeMatch[3], idx: codeMatch[1].length },
      strikethroughMatch && { type: "strikethrough", before: strikethroughMatch[1], inner: strikethroughMatch[2], after: strikethroughMatch[3], idx: strikethroughMatch[1].length },
      italicMatch && { type: "italic", before: italicMatch[1], inner: italicMatch[2], after: italicMatch[3], idx: italicMatch[1].length },
    ].filter(Boolean);

    if (matches.length === 0) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const first = matches.reduce((a, b) => a.idx <= b.idx ? a : b);
    if (first.before) parts.push(<span key={key++}>{first.before}</span>);

    switch (first.type) {
      case "bold":
        parts.push(<strong key={key++} style={{ color: TOKENS.colors.text, fontWeight: 800, letterSpacing: "-0.01em" }}>{first.inner}</strong>);
        break;
      case "underline":
        parts.push(<span key={key++} style={{ textDecoration: "underline", textDecorationColor: "#a78bfa", textUnderlineOffset: 3, textDecorationThickness: 2 }}>{first.inner}</span>);
        break;
      case "highlight":
        parts.push(<mark key={key++} style={{ background: "rgba(167,139,250,0.20)", color: TOKENS.colors.text, borderRadius: 6, padding: "2px 6px", fontWeight: 600 }}>{first.inner}</mark>);
        break;
      case "code":
        parts.push(<code key={key++} style={{ background: "rgba(255,255,255,0.06)", color: "#c4b5fd", padding: "2px 8px", borderRadius: 6, fontSize: "0.88em", fontFamily: TOKENS.fonts.mono, border: "1px solid rgba(255,255,255,0.06)" }}>{first.inner}</code>);
        break;
      case "strikethrough":
        parts.push(<span key={key++} style={{ textDecoration: "line-through", opacity: 0.5 }}>{first.inner}</span>);
        break;
      case "italic":
        parts.push(<em key={key++} style={{ color: "#c4b5fd", fontStyle: "italic" }}>{first.inner}</em>);
        break;
    }
    remaining = first.after;
  }
  return parts;
}

function renderText(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.startsWith("* ") ? line.slice(2) : line.slice(2);
      return (
        <div key={i} style={{ display: "flex", gap: 12, margin: "6px 0", alignItems: "flex-start" }}>
          <span style={{ color: "#a78bfa", flexShrink: 0, fontSize: 18, lineHeight: 1.6, textShadow: "0 0 12px rgba(167,139,250,0.6)", marginTop: 2 }}>◆</span>
          <span style={{ lineHeight: 1.7, color: TOKENS.colors.textMuted, flex: 1, fontSize: 14 }}>{formatInline(content)}</span>
        </div>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\.\s/)[1];
      const rest = line.replace(/^\d+\.\s/, "");
      return (
        <div key={i} style={{ display: "flex", gap: 12, margin: "6px 0", alignItems: "flex-start" }}>
          <span style={{ color: "#a78bfa", flexShrink: 0, fontWeight: 900, fontSize: 14, lineHeight: 1.7, minWidth: 24, textAlign: "center", background: "rgba(167,139,250,0.15)", borderRadius: 6, padding: "2px 6px" }}>{num}</span>
          <span style={{ lineHeight: 1.7, color: TOKENS.colors.textMuted, flex: 1, fontSize: 14 }}>{formatInline(rest)}</span>
        </div>
      );
    }
    if (line.startsWith("## ") || line.startsWith("# ")) {
      const txt = line.replace(/^#+\s/, "");
      return (
        <p key={i} style={{ margin: "14px 0 8px", lineHeight: 1.4, color: TOKENS.colors.text, fontWeight: 800, fontSize: 16, borderBottom: "1px solid rgba(167,139,250,0.15)", paddingBottom: 6, letterSpacing: "-0.01em" }}>{formatInline(txt)}</p>
      );
    }
    if (line === "---" || line === "———") {
      return <div key={i} style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", margin: "12px 0" }}/>;
    }
    if (!line.trim()) return <div key={i} style={{ height: 8 }}/>;
    return (
      <p key={i} style={{ margin: "5px 0", lineHeight: 1.75, color: TOKENS.colors.textMuted, fontSize: 14 }}>{formatInline(line)}</p>
    );
  });
}

// ═══════════════════════════════════════════════════════════
// PREMIUM ANIMATED BACKGROUND COMPONENT — Particle System
// ═══════════════════════════════════════════════════════════
function PremiumBackground({ agent }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const colors = agent ? [agent.color, '#a855f7', '#6366f1'] : ['#a855f7', '#6366f1', '#06b6d4', '#f59e0b'];

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5, color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.1, pulse: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { p.vx -= dx * 0.0001; p.vy -= dy * 0.0001; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        const pulseAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + 0.3 * Math.sin(p.pulse)), 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = pulseAlpha; ctx.fill();

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        gradient.addColorStop(0, p.color); gradient.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient; ctx.globalAlpha = pulseAlpha * 0.15; ctx.fill();

        particlesRef.current.slice(i + 1).forEach(p2 => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color; ctx.globalAlpha = (1 - d / 120) * 0.08;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [agent]);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM AMBIENT ORBS — Floating Light Effects
// ═══════════════════════════════════════════════════════════
function AmbientOrbs({ agent }) {
  const orbs = useMemo(() => {
    const baseColors = agent ? [agent.color, agent.color, '#a855f7'] : ['#a855f7', '#6366f1', '#06b6d4', '#f59e0b', '#ef4444'];
    return baseColors.map((color, i) => ({
      color, size: 300 + Math.random() * 400,
      x: 10 + (i * 25) + Math.random() * 15, y: 10 + Math.random() * 60,
      duration: 20 + Math.random() * 15, delay: i * -5,
    }));
  }, [agent]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {orbs.map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', left: orb.x + "%", top: orb.y + "%",
          width: orb.size, height: orb.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${orb.color}18 0%, ${orb.color}08 40%, transparent 70%)`,
          filter: TOKENS.blur.xxl,
          animation: "orbFloat " + orb.duration + "s " + orb.delay + "s ease-in-out infinite",
          transform: 'translate(-50%, -50%)',
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM GLASS CARD — Liquid Glassmorphism
// ═══════════════════════════════════════════════════════════
function GlassCard({ children, style = {}, hoverEffect = true, glowColor = null }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverEffect && setIsHovered(true)}
      onMouseLeave={() => hoverEffect && setIsHovered(false)}
      style={{
        position: 'relative',
        background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)',
        border: "1px solid " + (isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"),
        borderRadius: TOKENS.radii.xl,
        backdropFilter: TOKENS.blur.lg,
        WebkitBackdropFilter: TOKENS.blur.lg,
        transition: TOKENS.transitions.normal,
        overflow: 'hidden',
        ...style,
      }}
    >
      {glowColor && isHovered && (
        <div style={{
          position: 'absolute', inset: -1, borderRadius: TOKENS.radii.xl + 1,
          background: "radial-gradient(circle at 50% 0%, " + glowColor + "30, transparent 70%)",
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM BUTTON — Haptic Feedback Style
// ═══════════════════════════════════════════════════════════
function PremiumButton({ children, onClick, variant = 'primary', color = TOKENS.colors.accent.primary, disabled = false, style = {}, icon = null }) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: {
      background: disabled ? 'rgba(255,255,255,0.05)' : "linear-gradient(135deg, " + color + ", " + color + "dd)",
      color: '#fff',
      border: "1px solid " + (disabled ? "rgba(255,255,255,0.05)" : color + "60"),
      boxShadow: isHovered && !disabled ? "0 8px 32px " + color + "40, 0 0 0 1px " + color + "30" : 'none',
    },
    secondary: {
      background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      color: TOKENS.colors.text,
      border: "1px solid " + (isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"),
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent', color: TOKENS.colors.textMuted,
      border: '1px solid transparent', boxShadow: 'none',
    },
  };

  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '12px 24px', borderRadius: TOKENS.radii.lg,
        fontFamily: TOKENS.fonts.primary, fontSize: 14, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: TOKENS.transitions.fast,
        transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)',
        ...v,
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM SMART LEAD FORM — Conversion Optimized
// ═══════════════════════════════════════════════════════════
function SmartLeadForm({ agent, t, lang = "hindi", onSubmit, onSkip }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ready = phone.length === 10;

  const submit = () => {
    if (!ready) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const agentName = agent?.name || "Financial";
      const agentHi = agent?.hi || "वित्तीय";
      const txt = lang === "english"
        ? `Hello! I am ${name || "a user"}.%0AAgent: ${agentName}%0AMobile: +91${phone}%0AFrom SAHAYAK App — need expert help.`
        : `नमस्ते! मैं ${name || "उपयोगकर्ता"} हूँ।%0Aविशेषज्ञ: ${agentHi}%0AMobile: +91${phone}%0ASAHAYAK App से — मुझे सहायता चाहिए।`;
      window.open(`https://wa.me/918115776644?text=${txt}`, "_blank");
      setStep("success");
      setIsSubmitting(false);
      onSubmit(name);
    }, 800);
  };

  if (step === "success") {
    return (
      <GlassCard style={{ padding: "24px", textAlign: "center", borderColor: "rgba(34,197,94,0.3)" }} glowColor={TOKENS.colors.success}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}>🎉</div>
        <div style={{ fontWeight: 800, color: "#4ade80", fontSize: 16, marginBottom: 8 }}>
          {lang === "hindi" ? t.thankYou + "!" : t.thankYou + "!"}
        </div>
        <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.6 }}>
          {lang === "hindi" ? t.expertWillContact : t.expertWillContact}
        </div>
        <div style={{ fontSize: 11, opacity: 0.35, marginTop: 8 }}>WhatsApp</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={{ padding: "20px" }} glowColor={agent?.color}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: agent?.iconBg || "rgba(139,92,246,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, border: `1px solid ${agent?.color || "#a855f7"}30`,
        }}>{agent?.icon || "🎯"}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: agent?.color || "#a855f7" }}>{t?.callback || "Free Callback!"}</div>
          <div style={{ fontSize: 12, opacity: 0.45, marginTop: 2 }}>{t?.callbackSub || "Our expert will contact you on WhatsApp"}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder={t?.namePlaceholder || "Your name (optional)"}
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: TOKENS.radii.lg,
            border: `1px solid ${agent?.color || "#a855f7"}25`,
            background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, outline: "none",
            fontFamily: TOKENS.fonts.primary, transition: TOKENS.transitions.fast, boxSizing: "border-box",
          }}
          onFocus={e => { e.target.style.borderColor = `${agent?.color || "#a855f7"}60`; e.target.style.background = "rgba(255,255,255,0.05)"; }}
          onBlur={e => { e.target.style.borderColor = `${agent?.color || "#a855f7"}25`; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />
        <input
          placeholder={t?.phonePlaceholder || "Mobile number (10 digits)"}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
          type="tel"
          style={{
            width: "100%", padding: "12px 16px", borderRadius: TOKENS.radii.lg,
            border: `1px solid ${agent?.color || "#a855f7"}25`,
            background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, outline: "none",
            fontFamily: TOKENS.fonts.primary, transition: TOKENS.transitions.fast, boxSizing: "border-box",
          }}
          onFocus={e => { e.target.style.borderColor = `${agent?.color || "#a855f7"}60`; e.target.style.background = "rgba(255,255,255,0.05)"; }}
          onBlur={e => { e.target.style.borderColor = `${agent?.color || "#a855f7"}25`; e.target.style.background = "rgba(255,255,255,0.03)"; }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <PremiumButton onClick={submit} disabled={!ready || isSubmitting} color={agent?.color} style={{ flex: 1 }} icon={isSubmitting ? "⏳" : "📱"}>
            {isSubmitting ? (lang === "hindi" ? "भेज रहा है..." : "Sending...") : (t?.sendWA || "Send on WhatsApp")}
          </PremiumButton>
          <PremiumButton onClick={onSkip} variant="secondary" style={{ padding: "12px 18px" }}>
            {t?.later || "Later"}
          </PremiumButton>
        </div>
      </div>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM SOLAR CALCULATOR — Interactive Dashboard
// ═══════════════════════════════════════════════════════════
function PremiumSolarPanel({ lang, onSend }) {
  const t = UI[lang];
  const [kw, setKw] = useState(3);
  const [state, setState] = useState("UP");
  const [type, setType] = useState("home");
  const result = useMemo(() => calcSolar(kw, state), [kw, state]);
  const formatCurrency = (num) => "₹" + num.toLocaleString("en-IN");

  return (
    <GlassCard style={{ margin: "16px", padding: "24px" }} glowColor={TOKENS.colors.accent.quaternary}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg, #f59e0b20, #f9731620)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, border: "1px solid rgba(245,158,11,0.2)",
        }}>☀️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#f59e0b" }}>{t.calcTitle}</div>
          <div style={{ fontSize: 12, opacity: 0.45 }}>PM Surya Ghar Subsidy</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: TOKENS.colors.textMuted }}>{t.capacity}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b" }}>{kw} KW</span>
          </div>
          <input type="range" min="1" max="10" step="0.5" value={kw}
            onChange={e => setKw(parseFloat(e.target.value))}
            style={{ width: "100%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", outline: "none", appearance: "none", WebkitAppearance: "none" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ key: "home", label: t.home, icon: "🏠" }, { key: "commercial", label: t.commercial, icon: "🏭" }].map((item) => (
            <button key={item.key} onClick={() => setType(item.key)}
              style={{
                flex: 1, padding: "10px", borderRadius: TOKENS.radii.lg,
                border: `1px solid ${type === item.key ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.06)'}`,
                background: type === item.key ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.02)',
                color: type === item.key ? '#f59e0b' : TOKENS.colors.textMuted,
                fontFamily: TOKENS.fonts.primary, fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: TOKENS.transitions.fast,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: t.centralSub, value: formatCurrency(result.central), color: "#a855f7" },
            { label: t.stateExtra, value: formatCurrency(result.stateS), color: "#06b6d4" },
            { label: t.totalSub, value: formatCurrency(result.total), color: "#22c55e" },
            { label: t.netCost, value: formatCurrency(result.net), color: "#f59e0b" },
            { label: t.annualSaving, value: formatCurrency(result.saving), color: "#14b8a6" },
            { label: t.payback, value: `${result.payback} ${t.years}`, color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px", borderRadius: TOKENS.radii.lg, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
              <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
        {type === "commercial" && (
          <div style={{ padding: "14px", borderRadius: TOKENS.radii.lg, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", fontSize: 12, lineHeight: 1.7, color: TOKENS.colors.textMuted, whiteSpace: "pre-line" }}>
            {t.commercialNote}
          </div>
        )}
        <PremiumButton onClick={() => onSend(`${t.surveyBtn} — ${kw}KW ${type === "home" ? t.home : t.commercial} ${state}`)} color="#25d366" icon="💬" style={{ width: "100%" }}>
          {t.surveyBtn}
        </PremiumButton>
      </div>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM DOCUMENT UPLOAD — Drag & Drop Support
// ═══════════════════════════════════════════════════════════
function DocUploadBtn({ lang, agent, onAttach }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert(lang === "hindi" ? UI.hindi.fileTooLarge : UI.english.fileTooLarge);
      return;
    }
    setPreview(file.name);
    onAttach(file);
    setTimeout(() => setPreview(null), 3000);
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" style={{ display: "none" }}
        onChange={e => handleFile(e.target.files?.[0])} onClick={e => e.target.value = ""} />
      <button
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        title={lang === "hindi" ? "📎 दस्तावेज़ / फ़ोटो अपलोड करें" : "📎 Upload document or photo"}
        style={{
          width: 48, height: 48, borderRadius: TOKENS.radii.lg, flexShrink: 0,
          background: preview ? "linear-gradient(145deg,#7c3aed,#4f46e5)" : isDragging ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.95)",
          border: preview ? "2px solid #7c3aed" : isDragging ? "2px dashed rgba(124,58,237,0.6)" : "2px solid rgba(255,255,255,1)",
          cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
          transition: TOKENS.transitions.fast,
          boxShadow: preview ? "0 0 0 4px rgba(124,58,237,0.25), 0 4px 14px rgba(124,58,237,0.4)" : isDragging ? "0 0 0 4px rgba(124,58,237,0.15)" : "0 4px 14px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1)",
          color: preview || isDragging ? "#fff" : "#1a1a2e",
          transform: preview ? "scale(1.05)" : isDragging ? "scale(1.08)" : "scale(1)",
        }}
      >
        {preview ? "✅" : isDragging ? "📥" : "📎"}
      </button>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// PREMIUM TYPING INDICATOR — Animated Dots
// ═══════════════════════════════════════════════════════════
function TypingIndicator({ agent, t }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 20 }}>
      <div style={{ position: "relative", width: 32, height: 32, animation: "breathe 2s ease-in-out infinite" }}>
        <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: `radial-gradient(circle, ${agent.color}50 0%, transparent 70%)`, filter: TOKENS.blur.sm, animation: "pulse-glow 2s ease-in-out infinite" }} />
        <img src={LOGO} alt="SAHAYAK" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid " + agent.color + "50", position: "relative", zIndex: 1 }} />
      </div>
      <div style={{ background: TOKENS.colors.surface, borderRadius: "18px 18px 18px 4px", padding: "11px 15px", display: "flex", gap: 4, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: TOKENS.blur.md }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: agent.color, animation: `typing-bounce 1.4s ${i * 0.15}s infinite ease-in-out` }} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: TOKENS.colors.textDim, marginLeft: 4 }}>{t.typing}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN SAHAYAK PREMIUM APP — World-Class Experience
// ═══════════════════════════════════════════════════════════
function PolicyPage({ lang, onBack }) {
  const isH = lang !== "english";
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Noto Sans Devanagari','Segoe UI',sans-serif", background: "#05050a", color: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(74,222,128,0.12)", background: "rgba(5,5,10,0.95)", position: "sticky", top: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: 0 }}>←</button>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{isH ? "गोपनीयता नीति & नियम" : "Privacy Policy & Terms"}</div>
      </div>
      <div style={{ flex: 1, padding: "20px 16px", maxWidth: 560, margin: "0 auto", width: "100%", boxSizing: "border-box", overflowY: "auto" }}>
        
        {/* Company Info */}
        <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#4ade80", marginBottom: 10 }}>🏢 {isH ? "कंपनी की जानकारी" : "Company Information"}</div>
          <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.8 }}>
            <div><strong style={{ color: "#fff" }}>{isH ? "कंपनी का नाम:" : "Company Name:"}</strong> HAANS Solar</div>
            <div><strong style={{ color: "#fff" }}>GST {isH ? "नंबर:" : "Number:"}</strong> 09DIYPS3881N1ZT</div>
            <div><strong style={{ color: "#fff" }}>{isH ? "संस्थापक:" : "Founder:"}</strong> Ankit Singh</div>
            <div><strong style={{ color: "#fff" }}>{isH ? "पता:" : "Address:"}</strong> Nawanagar, Chouhattar Kalan, Balrampur, UP - 271208</div>
            <div><strong style={{ color: "#fff" }}>{isH ? "ईमेल:" : "Email:"}</strong> xsuvidha@gmail.com</div>
            <div><strong style={{ color: "#fff" }}>{isH ? "फोन:" : "Phone:"}</strong> +91 8115776644</div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#a78bfa", marginBottom: 10 }}>🔒 {isH ? "गोपनीयता नीति" : "Privacy Policy"}</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.9, opacity: 0.75 }}>
            {isH ? (
              <>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>डेटा संग्रह:</strong> SAHAYAK केवल वही जानकारी एकत्र करता है जो आप स्वेच्छा से प्रदान करते हैं — जैसे नाम, मोबाइल नंबर और शहर का नाम।</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>डेटा का उपयोग:</strong> आपकी जानकारी केवल आपसे संपर्क करने और उचित वित्तीय/सोलर सेवाएं प्रदान करने के लिए उपयोग की जाती है।</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>डेटा साझाकरण:</strong> हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को नहीं बेचते। केवल सेवा प्रदान करने हेतु HAANS Solar के प्रतिनिधि से साझा की जाती है।</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>AI चैट:</strong> आपकी बातचीत AI द्वारा प्रोसेस की जाती है। हम चैट इतिहास संग्रहीत नहीं करते।</p>
                <p><strong style={{ color: "#a78bfa" }}>WhatsApp:</strong> लीड फॉर्म भरने पर आपकी जानकारी WhatsApp के माध्यम से हमारी टीम को भेजी जाती है।</p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>Data Collection:</strong> SAHAYAK collects only information you voluntarily provide — name, mobile number, and city.</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>Data Usage:</strong> Your information is used solely to contact you and provide relevant financial/solar services.</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>Data Sharing:</strong> We do not sell personal data. It is shared only with HAANS Solar representatives for service delivery.</p>
                <p style={{ marginBottom: 8 }}><strong style={{ color: "#a78bfa" }}>AI Chat:</strong> Conversations are processed by AI. We do not store chat history.</p>
                <p><strong style={{ color: "#a78bfa" }}>WhatsApp:</strong> Lead form submissions are sent to our team via WhatsApp.</p>
              </>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div style={{ background: "rgba(243,156,18,0.06)", border: "1px solid rgba(243,156,18,0.15)", borderRadius: 14, padding: 16, marginBottom: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#f39c12", marginBottom: 10 }}>📜 {isH ? "नियम और शर्तें" : "Terms & Conditions"}</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.9, opacity: 0.75 }}>
            {isH ? (
              <>
                <p style={{ marginBottom: 8 }}>• SAHAYAK एक AI-आधारित सूचना सेवा है। यह कानूनी, वित्तीय या बीमा सलाह का विकल्प नहीं है।</p>
                <p style={{ marginBottom: 8 }}>• SAHAYAK पर प्रदान की गई जानकारी सामान्य मार्गदर्शन के लिए है। किसी भी वित्तीय निर्णय से पहले योग्य विशेषज्ञ से परामर्श लें।</p>
                <p style={{ marginBottom: 8 }}>• HAANS Solar, Ankit Singh (GST: 09DIYPS3881N1ZT) द्वारा संचालित एकल स्वामित्व है।</p>
                <p style={{ marginBottom: 8 }}>• VLE-IRDAI लाइसेंस: CSC/VLEINS/UP/2025/452693 | GST Suvidha Network partner | MFINS Solar Channel Partner।</p>
                <p style={{ marginBottom: 8 }}>• PM Surya Ghar: HAANS Solar एक अधिकृत वेंडर है। सब्सिडी राशि सरकारी नीतियों पर निर्भर है।</p>
                <p>• सेवा का उपयोग करके आप इन नियमों से सहमत हैं।</p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 8 }}>• SAHAYAK is an AI-based information service and does not replace legal, financial, or insurance advice.</p>
                <p style={{ marginBottom: 8 }}>• Information provided is for general guidance only. Consult a qualified expert before making financial decisions.</p>
                <p style={{ marginBottom: 8 }}>• HAANS Solar is a sole proprietorship operated by Ankit Singh (GST: 09DIYPS3881N1ZT).</p>
                <p style={{ marginBottom: 8 }}>• VLE-IRDAI License: CSC/VLEINS/UP/2025/452693 | GST Suvidha Network Partner | MFINS Solar Channel Partner.</p>
                <p style={{ marginBottom: 8 }}>• PM Surya Ghar: HAANS Solar is an authorized vendor. Subsidy amounts are subject to government policies.</p>
                <p>• By using this service, you agree to these terms.</p>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: "rgba(231,76,60,0.06)", border: "1px solid rgba(231,76,60,0.15)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#f87171", marginBottom: 8 }}>⚠️ {isH ? "अस्वीकरण" : "Disclaimer"}</div>
          <div style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.7 }}>
            {isH
              ? "SAHAYAK AI द्वारा उत्पन्न जानकारी प्रदान करता है जो पूरी तरह सटीक नहीं हो सकती। महत्वपूर्ण निर्णयों के लिए हमेशा अधिकृत विशेषज्ञ से सत्यापित करें।"
              : "SAHAYAK provides AI-generated information which may not always be accurate. Always verify with authorized experts for important decisions."}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, opacity: 0.25, marginBottom: 20 }}>
          {isH ? "अंतिम अपडेट: मई 2026 • HAANS Solar © 2026" : "Last Updated: May 2026 • HAANS Solar © 2026"}
        </div>
      </div>
    </div>
  );
}


function SolarQuoteForm({ lang, onSubmit, onSkip }) {
  const isH = lang !== "english";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sysType, setSysType] = useState("ongrid");
  const [units, setUnits] = useState("");
  const WA = "https://wa.me/918115776644";

  const ready = name.trim() && phone.length === 10 && city.trim() && units.trim();

  const submit = () => {
    if (!ready) return;
    const sysLabel = isH
      ? (sysType === "ongrid" ? "ऑनग्रिड" : "हाइब्रिड")
      : (sysType === "ongrid" ? "On-Grid" : "Hybrid");
    const msg = isH
      ? `🌞 *HAANS Solar — सोलर कोटेशन अनुरोध*%0A%0A*नाम:* ${name}%0A*मोबाइल:* +91${phone}%0A*शहर:* ${city}%0A*सिस्टम प्रकार:* ${sysLabel}%0A*औसत मासिक खपत:* ${units} यूनिट%0A%0ASAHAYAK App से भेजा गया। कृपया कोटेशन भेजें।`
      : `🌞 *HAANS Solar — Solar Quotation Request*%0A%0A*Name:* ${name}%0A*Mobile:* +91${phone}%0A*City:* ${city}%0A*System Type:* ${sysLabel}%0A*Avg Monthly Units:* ${units} units%0A%0ASent via SAHAYAK App. Please send quotation.`;
    window.open(`${WA}?text=${msg}`, "_blank");
    onSubmit(name);
  };

  const inputStyle = {
    width: "100%", padding: "10px 13px", borderRadius: 11,
    border: "1px solid rgba(0,184,148,0.35)", background: "rgba(0,184,148,0.06)",
    color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", marginBottom: 10,
  };

  return (
    <div style={{ margin: "6px 0", borderRadius: 18, background: "rgba(0,184,148,0.08)", border: "1px solid rgba(0,184,148,0.3)", padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: "#00b894", marginBottom: 4 }}>
        🧾 {isH ? "मुफ्त सोलर कोटेशन पाएं!" : "Get Free Solar Quotation!"}
      </div>
      <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 12 }}>
        {isH ? "HAANS Solar — MFINS Partner • 5 मिनट में WhatsApp पर" : "HAANS Solar — MFINS Partner • On WhatsApp in 5 mins"}
      </div>

      <input placeholder={isH ? "आपका नाम *" : "Your Name *"}
        value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input placeholder={isH ? "मोबाइल नंबर * (10 अंक)" : "Mobile Number * (10 digits)"}
        value={phone} onChange={e => setPhone(e.target.value.replace(/\D/,"").slice(0,10))}
        type="tel" style={inputStyle} />
      <input placeholder={isH ? "शहर का नाम *" : "City Name *"}
        value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />

      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>
        {isH ? "सिस्टम प्रकार:" : "System Type:"}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[
          { val: "ongrid", hi: "⚡ ऑनग्रिड", en: "⚡ On-Grid" },
          { val: "hybrid", hi: "🔋 हाइब्रिड", en: "🔋 Hybrid" },
        ].map(opt => (
          <button key={opt.val} onClick={() => setSysType(opt.val)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none", fontFamily: "inherit",
            background: sysType === opt.val ? "linear-gradient(135deg,#00b894,#00796b)" : "rgba(255,255,255,0.06)",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: sysType === opt.val ? "0 3px 12px rgba(0,184,148,0.4)" : "none",
          }}>
            {isH ? opt.hi : opt.en}
          </button>
        ))}
      </div>

      <input placeholder={isH ? "औसत मासिक बिजली खपत (यूनिट) *  जैसे: 300" : "Avg Monthly Units * e.g. 300"}
        value={units} onChange={e => setUnits(e.target.value.replace(/\D/,""))}
        type="tel" style={inputStyle} />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={submit} disabled={!ready} style={{
          flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
          background: ready ? "linear-gradient(135deg,#00b894,#00796b)" : "rgba(255,255,255,0.07)",
          color: "#fff", fontWeight: 800, fontSize: 13, cursor: ready ? "pointer" : "not-allowed",
          fontFamily: "inherit", boxShadow: ready ? "0 4px 16px rgba(0,184,148,0.4)" : "none",
        }}>
          📱 {isH ? "WhatsApp पर कोटेशन मांगें" : "Request Quote on WhatsApp"}
        </button>
        <button onClick={onSkip} style={{
          padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer",
          fontSize: 12, fontFamily: "inherit",
        }}>
          {isH ? "बाद में" : "Later"}
        </button>
      </div>
    </div>
  );
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
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const t = UI[lang];
  const agentList = AGENTS[lang];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", handleScroll); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, showLead]);

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
        ? `${t.welcomeBack}, **${userName}**! 🙏\n\nI'm your **${ag.name} ${t.expert}** from SAHAYAK. ${t.readyToHelp} — completely **free**. ${t.pickQuestion}! 👇`
        : `${t.welcomeBack}, **${userName} जी**! 🙏\n\nमैं SAHAYAK का **${ag.name} ${t.expert}** हूँ। ${t.readyToHelp} — **बिल्कुल मुफ्त**। ${t.pickQuestion}! 👇`)
      : (lang === "english"
        ? `${t.greeting}! I'm your **${ag.name} ${t.expert}** from SAHAYAK! 🙏\n\n${t.readyToHelp} — completely **free**. ${t.pickQuestion}! 👇`
        : `${t.greeting}! मैं SAHAYAK का **${ag.name} ${t.expert}** हूँ! 🙏\n\n${t.readyToHelp} — **बिल्कुल मुफ्त**। ${t.pickQuestion}! 👇`);
    setMsgs([{ role: "assistant", content: greeting, timestamp: new Date() }]);
    setScreen("chat");
  }, [lang, t, userName]);

  const handleSpeak = async (text, idx) => {
    if (speaking === idx) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, "").replace(/\u0060/g, "").trim();
    const detectedLang = detectLang(cleanText);
    const voiceLang = detectedLang === "english" ? "english" : "hindi";
    const utt = new SpeechSynthesisUtterance(cleanText);
    const targetLang = voiceLang === "english" ? "en-IN" : "hi-IN";
    utt.lang = targetLang;
    utt.rate = 0.85;
    utt.pitch = 0.9;
    utt.volume = 1;
    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return false;
      const priorities = voiceLang === "hindi"
        ? [
            v => v.name.includes("Microsoft") && v.name.includes("Swara") && v.name.includes("Online"),
            v => v.name.includes("Microsoft") && v.name.includes("Madhur"),
            v => v.name.includes("Google") && v.lang === "hi-IN",
            v => v.lang === "hi-IN",
            v => v.lang.startsWith("hi"),
          ]
        : [
            v => v.name.includes("Microsoft") && v.name.includes("Ravi") && v.name.includes("Online"),
            v => v.name.includes("Microsoft") && v.name.includes("Neural") && v.lang.startsWith("en-IN"),
            v => v.name.includes("Google") && v.lang === "en-IN",
            v => v.lang === "en-IN",
            v => v.lang.startsWith("en") && v.name.includes("Male"),
            v => v.lang.startsWith("en"),
          ];
      for (const priority of priorities) {
        const match = voices.find(priority);
        if (match) { utt.voice = match; return true; }
      }
      return false;
    };
    if (!trySetVoice()) {
      window.speechSynthesis.onvoiceschanged = () => { trySetVoice(); window.speechSynthesis.onvoiceschanged = null; };
    }
    utt.onstart = () => setSpeaking(idx);
    utt.onend = () => setSpeaking(null);
    utt.onerror = () => setSpeaking(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  };

  const startVoiceHold = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(lang === "hindi" ? t.voiceNotSupported : t.voiceNotSupported); return; }
    if (isListening) return;
    const rec = new SpeechRecognition();
    rec.lang = lang === "english" ? "en-IN" : "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) setInput(prev => { const hasDoc = prev.includes("📎"); return hasDoc ? prev + " " + final : final; });
    };
    rec.onerror = () => { setIsListening(false); };
    rec.onend = () => { setIsListening(false); };
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const stopVoiceHold = () => {
    if (!isListening) return;
    recognitionRef.current?.stop();
    setIsListening(false);
    setTimeout(() => {
      setInput(prev => { if (prev.trim() && !prev.includes("📎")) { send(prev); return ""; } return prev; });
    }, 400);
  };

  const send = useCallback(async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    const docContext = uploadedDoc;
    setUploadedDoc(null);
    stopSpeech();
    const detectedLang = detectLang(q);
    const updated = [...msgs, { role: "user", content: q, timestamp: new Date() }];
    setMsgs(updated);
    setLoading(true);
    try {
      const docNote = docContext ? `\n\nIMPORTANT: The user has uploaded a document (${docContext.fileName}). Their question is about this document. ${docContext.imageBase64 ? "The document image has been provided. Analyze it carefully." : docContext.analysisText || ""}` : "";
      const system = getSystemPrompt(agent.id, detectedLang) + docNote;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system, messages: updated.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      const reply = data?.content?.map(c => c.text || "").join("") || (lang === "hindi" ? t.retry : t.retry);
      setMsgs([...updated, { role: "assistant", content: reply, timestamp: new Date() }]);
    } catch {
      setMsgs([...updated, { role: "assistant", content: lang === "hindi" ? t.networkError : t.networkError, timestamp: new Date() }]);
    }
    setLoading(false);
  }, [msgs, input, loading, agent, lang, t, uploadedDoc]);

  const handleDocResult = (analysisText, fileName, imageBase64, mediaType) => {
    setUploadedDoc({ analysisText, fileName, imageBase64, mediaType });
    const hint = lang === "hindi" ? `📎 ${fileName} — अब लिखें आप क्या जानना चाहते हैं इस दस्तावेज़ के बारे में...` : `📎 ${fileName} — Now type what you want to know about this document...`;
    setInput(hint.slice(0, 120));
    setMsgs(prev => [...prev, {
      role: "user",
      content: lang === "hindi" ? `📎 **${t.docUploaded}:** ${fileName}\n\n${t.typeQuestion} ↗️` : `📎 **${t.docUploaded}:** ${fileName}\n\n${t.typeQuestion} ↗️`,
      timestamp: new Date(), isDoc: true
    }]);
  };

  const handleLeadSubmit = (name) => {
    if (name) setUserName(name);
    setShowLead(false);
    const msg = lang === "english"
      ? `${t.thankYou}${name ? `, ${name}` : ""}! 🙏 ${t.expertWillContact}. ${t.continueChat}!`
      : `${t.thankYou}${name ? `, ${name} जी` : ""}! 🙏 ${t.expertWillContact}। ${t.continueChat}!`;
    setMsgs(prev => [...prev, { role: "assistant", content: msg, timestamp: new Date() }]);
  };

  // ═══════════════════════════════════════════════════════════
  // ABOUT SCREEN — Premium Profile Page
  // ═══════════════════════════════════════════════════════════
  if (screen === "policy") return (
    <PolicyPage lang={lang} onBack={() => setScreen("home")} />
  );

  if (screen === "about") return (
    <div style={{ minHeight: "100vh", background: TOKENS.colors.bg, color: TOKENS.colors.text, fontFamily: TOKENS.fonts.primary, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <PremiumBackground agent={null} />
      <AmbientOrbs agent={null} />
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(10,10,15,0.8)", backdropFilter: TOKENS.blur.lg, position: "sticky", top: 0, zIndex: 20 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: "8px", borderRadius: TOKENS.radii.md, transition: TOKENS.transitions.fast }} onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.target.style.background = "none"}>←</button>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{t.about}</div>
        </header>
        <div style={{ flex: 1, padding: "30px 20px", maxWidth: 540, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: 25, background: "linear-gradient(135deg, #a855f7, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 40px rgba(168,85,247,0.5)", position: "relative", overflow: "hidden" }}>
              <img src={LOGO} alt="SAHAYAK" style={{ width: 60, height: 60, objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.2))" }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2, background: "linear-gradient(90deg, #a78bfa, #fff, #7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SAHAYAK</div>
            <div style={{ fontSize: 14, opacity: 0.5, marginTop: 6 }}>{lang === "hindi" ? "आपका AI Financial दोस्त 🇮🇳" : "Your AI Financial Friend 🇮🇳"}</div>
            <div style={{ fontSize: 12, opacity: 0.3, marginTop: 4 }}>{t.version}</div>
          </div>
          <GlassCard style={{ padding: 20, marginBottom: 16 }} glowColor="#a855f7">
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>👨‍💼 {t.founder}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, flexShrink: 0, boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>A</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Ankit Singh</div>
                <div style={{ fontSize: 12, opacity: 0.55, marginTop: 2 }}>Founder & Creator, SAHAYAK</div>
                <div style={{ fontSize: 11, opacity: 0.4, marginTop: 1 }}>Balrampur, Uttar Pradesh 🇮🇳</div>
              </div>
            </div>
          </GlassCard>
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>📞 {t.contact}</div>
            <a href="mailto:xsuvidha@gmail.com" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#e2e8f0", marginBottom: 10, padding: "8px 0", borderRadius: TOKENS.radii.md, transition: TOKENS.transitions.fast }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: 20 }}>📧</span><span style={{ fontSize: 14 }}>xsuvidha@gmail.com</span>
            </a>
            <a href="https://wa.me/918115776644" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#e2e8f0", marginBottom: 10, padding: "8px 0", borderRadius: TOKENS.radii.md, transition: TOKENS.transitions.fast }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span style={{ fontSize: 20 }}>💬</span><span style={{ fontSize: 14 }}>+91 81157 76644</span>
            </a>
          <button onClick={() => setScreen("policy")} title="Privacy Policy & Terms"
            style={{ width: 40, height: 40, borderRadius: TOKENS.radii.lg, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "#4ade80", transition: TOKENS.transitions.fast }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.18)"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
          >📋</button>
          </GlassCard>
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>🏆 {t.certifications}</div>
            {[["🏛️","VLE-IRDAI","Insurance License — Govt. of India"],["📊","GST Suvidha Network","Authorized Tax Partner"],["☀️","MFINS Solar","Channel Partner"],["🌞","PM Surya Ghar","Authorized Vendor"]].map(([icon, title, sub], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0, padding: "6px 0" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div><div style={{ fontSize: 11, opacity: 0.45 }}>{sub}</div></div>
              </div>
            ))}
          </GlassCard>
          <GlassCard style={{ padding: 16, marginBottom: 20, background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,70,229,0.05))" }} glowColor="#a855f7">
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>🎯 {t.mission}</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.75 }}>
              {lang === "hindi" ? "हर भारतीय को उनकी अपनी भाषा में, पूरी तरह मुफ्त वित्तीय मार्गदर्शन उपलब्ध कराना। कोई भ्रम नहीं, कोई शोषण नहीं। SAHAYAK आपका भरोसेमंद दोस्त है — बीमा, टैक्स, सोलर और लोन के लिए।" : "To make financial guidance accessible to every Indian — in their own language, completely free. No more confusion, no more exploitation. SAHAYAK is your trusted friend for Insurance, Tax, Solar, and Loans."}
            </div>
          </GlassCard>
          <a href="https://instagram.com/singh.ankit007" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 20px", borderRadius: TOKENS.radii.xl, textDecoration: "none", color: "#fff", background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", boxShadow: "0 4px 20px rgba(220,39,67,0.3)", marginBottom: 20, fontWeight: 800, transition: TOKENS.transitions.fast }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(220,39,67,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,39,67,0.3)"; }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <div><div style={{ fontWeight: 800, fontSize: 15 }}>{t.followInstagram}</div><div style={{ fontSize: 12, opacity: 0.85 }}>@singh.ankit007</div></div>
          </a>
          <div style={{ textAlign: "center", fontSize: 11, opacity: 0.3 }}>SAHAYAK v3.0 Ultra • {t.madeInIndia}</div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // HOME SCREEN — Cinematic Entrance Experience
  // ═══════════════════════════════════════════════════════════
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", fontFamily: TOKENS.fonts.primary, background: TOKENS.colors.bg, color: TOKENS.colors.text, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <PremiumBackground agent={null} />
      <AmbientOrbs agent={null} />

      {/* Grid Pattern Overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 70%)" }} />

      {/* Header */}
      <header style={{
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
        background: scrollY > 50 ? "rgba(3,3,5,0.85)" : "transparent",
        backdropFilter: scrollY > 50 ? TOKENS.blur.lg : "none",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(168,85,247,0.5)",
            position: "relative", overflow: "hidden",
            animation: isLoaded ? "logoReveal 0.8s cubic-bezier(0.34,1.56,0.64,1)" : "none",
          }}>
            <img src={LOGO} alt="SAHAYAK" style={{ width: 32, height: 32, objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent, rgba(255,255,255,0.2))" }} />
          </div>
          <div style={{ animation: isLoaded ? "fadeSlideRight 0.6s 0.2s both" : "none" }}>
            <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 2, background: "linear-gradient(90deg, #a78bfa, #fff 50%, #7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SAHAYAK</div>
            <div style={{ fontSize: 10, opacity: 0.35, letterSpacing: 1, marginTop: 2 }}>{t.appSub}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, animation: isLoaded ? "fadeSlideLeft 0.6s 0.3s both" : "none" }}>
          <button onClick={() => setScreen("about")} title={t.about}
            style={{ width: 40, height: 40, borderRadius: TOKENS.radii.lg, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#a78bfa", transition: TOKENS.transitions.fast }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
          >ℹ️</button>
          <a href="https://instagram.com/singh.ankit007" target="_blank" rel="noreferrer"
            style={{ width: 40, height: 40, borderRadius: TOKENS.radii.lg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, textDecoration: "none", background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", boxShadow: "0 2px 10px rgba(220,39,67,0.35)", transition: TOKENS.transitions.fast }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(220,39,67,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(220,39,67,0.35)"; }}
          >📸</a>
          <div style={{ display: "flex", background: TOKENS.colors.surface, borderRadius: TOKENS.radii.lg, padding: 3, border: "1px solid rgba(255,255,255,0.08)", backdropFilter: TOKENS.blur.sm }}>
            {["hindi", "english"].map((l, i) => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  padding: "8px 16px", borderRadius: TOKENS.radii.md, border: "none",
                  background: lang === l ? TOKENS.colors.accent.primary : "transparent",
                  color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "inherit", transition: TOKENS.transitions.fast,
                  boxShadow: lang === l ? "0 2px 12px rgba(168,85,247,0.5)" : "none",
                  animation: isLoaded ? `fadeSlideUp 0.5s ${0.4 + i * 0.1}s both` : "none",
                }}
              >{l === "hindi" ? "हिंदी" : "EN"}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "40px 24px 24px", position: "relative", zIndex: 10 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 20px", borderRadius: TOKENS.radii.full,
          background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)",
          marginBottom: 24, backdropFilter: TOKENS.blur.sm,
          animation: isLoaded ? "fadeSlideUp 0.6s 0.5s both" : "none",
        }}>
          <span style={{ fontSize: 16 }}>🇮🇳</span>
          <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, letterSpacing: 1 }}>{t.tagline}</span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 32, fontWeight: 900, lineHeight: 1.2,
          color: TOKENS.colors.text, letterSpacing: -1,
          animation: isLoaded ? "fadeSlideUp 0.7s 0.6s both" : "none",
        }}>
          {t.headline1}<br/>
          <span style={{ background: "linear-gradient(90deg, #a78bfa, #7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.headline2}</span>
        </h1>
        <p style={{
          fontSize: 14, opacity: 0.45, marginTop: 16,
          maxWidth: 340, margin: "16px auto 0", lineHeight: 1.7,
          animation: isLoaded ? "fadeSlideUp 0.7s 0.7s both" : "none",
        }}>{t.sub}</p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "8px 16px 32px", maxWidth: 600, margin: "0 auto", width: "100%", boxSizing: "border-box", position: "relative", zIndex: 10 }}>
        {/* Solar Banner */}
        <div
          onClick={() => openAgent(agentList.find(a => a.id === "solar"))}
          style={{
            marginBottom: 20, padding: "20px 22px", borderRadius: TOKENS.radii.xxl,
            background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))",
            border: "1px solid rgba(245,158,11,0.25)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16,
            transition: TOKENS.transitions.slow,
            backdropFilter: TOKENS.blur.md,
            position: "relative", overflow: "hidden",
            animation: isLoaded ? "fadeSlideUp 0.8s 0.8s both" : "none",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.1))";
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(245,158,11,0.25), 0 0 0 1px rgba(245,158,11,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)", filter: TOKENS.blur.lg }} />
          <div style={{ fontSize: 40, filter: "drop-shadow(0 4px 12px rgba(245,158,11,0.5))", position: "relative", zIndex: 1 }}>☀️</div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#f59e0b", marginBottom: 4 }}>{t.solarBanner}</div>
            <div style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.6 }}>{t.solarSub}</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(245,158,11,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#f59e0b", transition: TOKENS.transitions.fast,
          }}>→</div>
        </div>

        {/* Section Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, animation: isLoaded ? "fadeSlideUp 0.8s 0.9s both" : "none" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: TOKENS.colors.accent.primary }} />
          <p style={{ fontSize: 11, opacity: 0.4, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>{t.otherExperts}</p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
        </div>

        {/* Agent Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, animation: isLoaded ? "fadeSlideUp 0.9s 1.0s both" : "none" }}>
          {agentList.filter(a => !a.solar).map((ag, index) => (
            <button key={ag.id} onClick={() => openAgent(ag)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${ag.color}12`,
                borderRadius: TOKENS.radii.xxl,
                padding: "20px 12px 16px",
                cursor: "pointer", textAlign: "center",
                color: TOKENS.colors.text,
                fontFamily: "inherit",
                transition: TOKENS.transitions.spring,
                backdropFilter: TOKENS.blur.md,
                position: "relative", overflow: "hidden",
                animation: isLoaded ? `fadeSlideUp 0.5s ${1.0 + index * 0.08}s both` : "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${ag.color}10`;
                e.currentTarget.style.borderColor = `${ag.color}40`;
                e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${ag.color}20, 0 4px 12px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = `${ag.color}12`;
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                width: 60, height: 60, borderRadius: "50%",
                background: `radial-gradient(circle, ${ag.color}25 0%, transparent 70%)`,
                filter: TOKENS.blur.md, opacity: 0, transition: "opacity 0.3s",
              }} className="agent-glow" />
              <div style={{
                fontSize: 28, marginBottom: 10, display: "inline-block",
                transition: "transform 0.3s", filter: `drop-shadow(0 4px 8px ${ag.color}40)`,
              }} className="agent-icon">{ag.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 11, color: ag.color, lineHeight: 1.3, marginBottom: 4 }}>{ag.name}</div>
              <div style={{ fontSize: 9, opacity: 0.35, lineHeight: 1.4 }}>{ag.tag}</div>
            </button>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a href={WA_BASE} target="_blank" rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 14,
            marginTop: 20, padding: "16px 20px",
            borderRadius: TOKENS.radii.xxl,
            background: "rgba(37,211,102,0.06)",
            border: "1px solid rgba(37,211,102,0.15)",
            textDecoration: "none", color: TOKENS.colors.text,
            transition: TOKENS.transitions.slow,
            backdropFilter: TOKENS.blur.md,
            animation: isLoaded ? "fadeSlideUp 1.0s 1.4s both" : "none",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.12)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,211,102,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(37,211,102,0.06)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "rgba(37,211,102,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#4ade80" }}>{t.chatOnWA}</div>
            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>+{WA_NUMBER} • {t.free}</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(37,211,102,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#4ade80",
          }}>→</div>
        </a>

        {/* Trust Badge */}
        <div style={{
          marginTop: 16, padding: "14px 18px",
          borderRadius: TOKENS.radii.xl,
          background: "rgba(139,92,246,0.04)",
          border: "1px solid rgba(139,92,246,0.1)",
          textAlign: "center", backdropFilter: TOKENS.blur.sm,
          animation: isLoaded ? "fadeSlideUp 1.1s 1.5s both" : "none",
        }}>
          <span style={{ fontSize: 12, color: "#a78bfa", opacity: 0.7, fontWeight: 600 }}>
            🔒 {t.certified}
          </span>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          33% { transform: translate(-50%, -50%) translate(30px, -20px); }
          66% { transform: translate(-50%, -50%) translate(-15px, 15px); }
        }
        @keyframes logoReveal {
          from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes voicePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 10px rgba(239,68,68,0.1); }
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; overflow-x: hidden; background: #030305; }
        input::placeholder, textarea::placeholder { color: rgba(248,248,255,0.25); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.5); }
        select option { background: #0c0c14; color: #fff; }
        button:hover .agent-glow { opacity: 1 !important; }
        button:hover .agent-icon { transform: scale(1.2) !important; }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          box-shadow: 0 0 20px rgba(245,158,11,0.5);
          cursor: pointer; border: 2px solid rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // CHAT SCREEN — Premium Conversation Experience
  // ═══════════════════════════════════════════════════════════
  const starters = agent.starters;
  return (
    <div style={{ minHeight: "100vh", fontFamily: TOKENS.fonts.primary, background: TOKENS.colors.bg, color: TOKENS.colors.text, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <PremiumBackground agent={agent} />
      <AmbientOrbs agent={agent} />

      {/* Chat Header */}
      <header style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 14,
        background: "rgba(3,3,5,0.88)", backdropFilter: TOKENS.blur.xl,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <button onClick={() => { setScreen("home"); stopSpeech(); }}
          style={{
            background: "none", border: "none", color: TOKENS.colors.textMuted,
            fontSize: 22, cursor: "pointer", padding: "6px 10px",
            borderRadius: TOKENS.radii.md, transition: TOKENS.transitions.fast,
          }}
          onMouseEnter={e => { e.target.style.background = TOKENS.colors.surface; e.target.style.color = TOKENS.colors.text; }}
          onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = TOKENS.colors.textMuted; }}
        >←</button>

        <div style={{ position: "relative", width: 44, height: 44, animation: speaking !== null ? "breathe 2s ease-in-out infinite" : "none" }}>
          <div style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: `radial-gradient(circle, ${agent.color}50 0%, transparent 70%)`,
            filter: TOKENS.blur.sm, opacity: speaking !== null ? 1 : 0.4,
            transition: "opacity 0.5s", animation: speaking !== null ? "pulse-glow 2s ease-in-out infinite" : "none",
          }} />
          <img src={LOGO} alt="SAHAYAK" style={{
            width: 44, height: 44, borderRadius: 12, objectFit: "cover",
            border: `2px solid ${agent.color}70`, position: "relative", zIndex: 1,
          }} />
          <div style={{
            position: "absolute", bottom: 0, right: 0, width: 12, height: 12,
            borderRadius: "50%", background: TOKENS.colors.success,
            border: `2px solid ${TOKENS.colors.bg}`, zIndex: 2,
            boxShadow: `0 0 10px ${TOKENS.colors.success}`,
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: TOKENS.colors.text }}>{agent.name} {t.expert}</div>
          <div style={{ fontSize: 11, color: TOKENS.colors.success, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: TOKENS.colors.success, display: "inline-block", boxShadow: `0 0 8px ${TOKENS.colors.success}` }} />
            {t.online}
          </div>
        </div>

        <a href={`${WA_BASE}?text=${lang === "english" ? `Hello! Need help with ${agent.name}.` : `नमस्ते! ${agent.name} के बारे में बात करनी है।`}`}
          target="_blank" rel="noreferrer"
          style={{
            background: "linear-gradient(135deg, #25d366, #128c7e)", borderRadius: TOKENS.radii.lg,
            padding: "10px 18px", fontSize: 12, color: "#fff", textDecoration: "none",
            fontWeight: 800, whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
            transition: TOKENS.transitions.fast,
            display: "flex", alignItems: "center", gap: 6,
          }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 8px 24px rgba(37,211,102,0.45)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(37,211,102,0.35)"; }}
        >
          <span>💬</span><span>WhatsApp</span>
        </a>
      </header>

      {/* Starter Questions */}
      {msgs.length <= 1 && (
        <div style={{ padding: "14px 16px 6px", display: "flex", flexWrap: "wrap", gap: 10, position: "relative", zIndex: 10 }}>
          {starters.map((q, i) => (
            <button key={i} onClick={() => send(q)}
              style={{
                background: agent.color + "08", border: "1px solid " + agent.color + "15",
                borderRadius: TOKENS.radii.full, padding: "10px 18px",
                color: TOKENS.colors.textMuted, cursor: "pointer", fontSize: 13,
                fontFamily: "inherit", transition: TOKENS.transitions.fast,
                backdropFilter: TOKENS.blur.sm, fontWeight: 500,
                animation: `fadeSlideUp 0.4s ${i * 0.1}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = agent.color + "18";
                e.currentTarget.style.borderColor = agent.color + "40";
                e.currentTarget.style.color = TOKENS.colors.text;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${agent.color}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = agent.color + "08";
                e.currentTarget.style.borderColor = agent.color + "15";
                e.currentTarget.style.color = TOKENS.colors.textMuted;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >{q}</button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div ref={chatContainerRef} style={{
        flex: 1, overflowY: "auto", padding: "14px 16px",
        display: "flex", flexDirection: "column", gap: 4,
        position: "relative", zIndex: 10,
      }}>
        {msgs.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} style={{
              display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: 12, marginBottom: 18,
              animation: `messageSlide 0.4s cubic-bezier(0.34,1.56,0.64,1)`,
            }}>
              {!isUser && (
                <div style={{ flexShrink: 0, marginBottom: 4 }}>
                  <div style={{
                    position: "relative", width: 36, height: 36,
                    animation: speaking === i ? "breathe 2s ease-in-out infinite" : "none",
                  }}>
                    <div style={{
                      position: "absolute", inset: -3, borderRadius: "50%",
                      background: `radial-gradient(circle, ${agent.color}50 0%, transparent 70%)`,
                      filter: TOKENS.blur.sm,
                      opacity: speaking === i ? 1 : 0.4,
                      transition: "opacity 0.5s",
                      animation: speaking === i ? "pulse-glow 2s ease-in-out infinite" : "none",
                    }} />
                    <img src={LOGO} alt="SAHAYAK" style={{
                      width: 36, height: 36, borderRadius: 10, objectFit: "cover",
                      border: `2px solid ${agent.color}60`, position: "relative", zIndex: 1,
                    }} />
                  </div>
                </div>
              )}

              <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Message Bubble */}
                <div style={{
                  background: isUser
                    ? `linear-gradient(135deg, ${agent.color}15, ${agent.color}05)`
                    : TOKENS.colors.surface,
                  border: `1px solid ${isUser ? `${agent.color}35` : TOKENS.colors.border}`,
                  borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  padding: "16px 20px",
                  backdropFilter: TOKENS.blur.lg,
                  WebkitBackdropFilter: TOKENS.blur.lg,
                  boxShadow: isUser
                    ? `0 4px 24px ${agent.color}15, 0 2px 8px rgba(0,0,0,0.2)`
                    : "0 4px 24px rgba(0,0,0,0.4)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: isUser
                      ? `linear-gradient(135deg, ${agent.color}04, transparent)`
                      : "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
                    pointerEvents: "none", borderRadius: "inherit",
                  }} />
                  <div style={{ position: "relative", zIndex: 1 }}>{renderText(msg.content)}</div>
                </div>

                {/* Message Actions */}
                {!isUser && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 4, marginTop: 2 }}>
                    <button onClick={() => handleSpeak(msg.content, i)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 14px 8px 10px", borderRadius: TOKENS.radii.full,
                        border: `2px solid ${speaking === i ? agent.color : "rgba(255,255,255,0.08)"}`,
                        background: speaking === i
                          ? "linear-gradient(135deg, " + agent.color + "90, " + agent.color + "60)"
                          : "rgba(255,255,255,0.03)",
                        color: speaking === i ? "#fff" : TOKENS.colors.textMuted,
                        fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                        cursor: "pointer", transition: TOKENS.transitions.fast,
                        backdropFilter: TOKENS.blur.sm,
                      }}
                      onMouseEnter={e => {
                        if (speaking !== i) {
                          e.target.style.background = agent.color + "10";
                          e.target.style.borderColor = agent.color + "25";
                        }
                      }}
                      onMouseLeave={e => {
                        if (speaking !== i) {
                          e.target.style.background = "rgba(255,255,255,0.03)";
                          e.target.style.borderColor = "rgba(255,255,255,0.08)";
                        }
                      }}
                    >
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: speaking === i ? agent.color + "50" : agent.color + "15",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10,
                      }}>{speaking === i ? "⏸" : "▶"}</span>
                      {speaking === i ? t.stop : t.listen}
                    </button>
                    <span style={{ fontSize: 10, color: TOKENS.colors.textDim, opacity: 0.5 }}>
                      {msg.timestamp?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Lead Form */}
        {showLead && (
          <div style={{
            margin: "20px 0", borderRadius: TOKENS.radii.xxl,
            background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid " + agent.color + "18",
            padding: 20, backdropFilter: TOKENS.blur.lg,
            position: "relative", overflow: "hidden",
            animation: "messageSlide 0.6s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{
              position: "absolute", inset: -1, borderRadius: TOKENS.radii.xxl + 1,
              background: "linear-gradient(135deg, " + agent.color + "15, transparent 50%)",
              pointerEvents: "none", zIndex: 0,
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 16, paddingBottom: 14,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: agent.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, border: "1px solid " + agent.color + "25",
                }}>{agent.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: agent.color }}>{t.callback}</div>
                  <div style={{ fontSize: 11, color: TOKENS.colors.textDim, marginTop: 2 }}>{t.callbackSub}</div>
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 16, padding: "10px 14px",
                background: "rgba(16,185,129,0.06)",
                borderRadius: TOKENS.radii.lg,
                border: "1px solid rgba(16,185,129,0.12)",
              }}>
                <span style={{ fontSize: 16 }}>🔒</span>
                <span style={{ fontSize: 12, color: TOKENS.colors.success, fontWeight: 600 }}>{t.trustBadge}</span>
              </div>
              <SmartLeadForm agent={agent} t={t} lang={lang} onSubmit={handleLeadSubmit} onSkip={() => setShowLead(false)} />
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {loading && <TypingIndicator agent={agent} t={t} />}
        <div ref={endRef} />
      </div>

      {/* Solar Calculator */}
      {agent.solar && <PremiumSolarPanel lang={lang} onSend={send} />}

      {/* Input Area */}
      <div style={{
        padding: "12px 16px 16px",
        background: "rgba(3,3,5,0.95)",
        backdropFilter: TOKENS.blur.xl,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        position: "relative", zIndex: 20,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <DocUploadBtn lang={lang} agent={agent} onAttach={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const b64 = e.target.result.split(",")[1];
              setUploadedDoc({ base64: b64, mediaType: file.type, name: file.name, isImage: file.type.startsWith("image/"), isPDF: file.type === "application/pdf" });
              setInput(prev => {
                const tag = "📎 [" + file.name + "] ";
                return prev.startsWith("📎") ? prev : tag + (prev || (lang === "hindi" ? "इस दस्तावेज़ के बारे में बताएं" : "Please analyze this document"));
              });
            };
            reader.readAsDataURL(file);
          }} />

          <button
            onMouseDown={startVoiceHold}
            onMouseUp={stopVoiceHold}
            onMouseLeave={stopVoiceHold}
            onTouchStart={(e) => { e.preventDefault(); startVoiceHold(); }}
            onTouchEnd={(e) => { e.preventDefault(); stopVoiceHold(); }}
            title={t.holdToSpeak}
            style={{
              width: 48, height: 48, borderRadius: TOKENS.radii.lg, flexShrink: 0,
              background: isListening
                ? "linear-gradient(145deg,#ef4444,#b91c1c)"
                : "rgba(255,255,255,0.95)",
              border: isListening
                ? "2px solid rgba(239,68,68,0.8)"
                : "2px solid rgba(255,255,255,1)",
              cursor: "pointer", fontSize: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: TOKENS.transitions.fast,
              animation: isListening ? "pulse-glow 0.6s infinite" : "none",
              transform: isListening ? "scale(1.12)" : "scale(1)",
              boxShadow: isListening
                ? "0 0 0 6px rgba(239,68,68,0.25), 0 4px 20px rgba(239,68,68,0.5)"
                : "0 4px 14px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1)",
              userSelect: "none", WebkitUserSelect: "none",
            }}
          >{isListening ? "🔴" : "🎤"}</button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={isListening ? (lang === "hindi" ? "बोल रहे हैं..." : "Listening...") : t.askHere}
            rows={1}
            style={{
              flex: 1,
              background: isListening ? "rgba(239,68,68,0.06)" : "rgba(255,245,235,0.95)",
              border: isListening ? "2px solid rgba(239,68,68,0.6)" : "1.5px solid " + agent.color + "30",
              animation: isListening ? "voicePulse 0.8s ease-in-out infinite" : "none",
              borderRadius: TOKENS.radii.lg,
              padding: "12px 16px",
              color: "#1a1a2e",
              fontSize: 14,
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              minHeight: 48,
              maxHeight: 120,
              lineHeight: 1.5,
              transition: TOKENS.transitions.fast,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
            }}
            onFocus={e => { e.target.style.borderColor = agent.color; e.target.style.boxShadow = `0 0 0 3px ${agent.color}15, inset 0 1px 3px rgba(0,0,0,0.06)`; }}
            onBlur={e => { e.target.style.borderColor = agent.color + "30"; e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.06)"; }}
          />

          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !loading
                ? "linear-gradient(145deg,#0ea5e9,#2563eb,#4f46e5)"
                : "linear-gradient(145deg,#1e293b,#0f172a)",
              border: input.trim() && !loading
                ? "1px solid rgba(99,102,241,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: TOKENS.transitions.fast,
              boxShadow: input.trim() && !loading
                ? "0 4px 20px rgba(79,70,229,0.5), 0 2px 6px rgba(0,0,0,0.5)"
                : "0 2px 6px rgba(0,0,0,0.3)",
            }}
            onMouseDown={e => { if (input.trim() && !loading) e.currentTarget.style.transform = "translateY(2px) scale(0.95)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 10, opacity: 0.15, textAlign: "center", marginTop: 8, letterSpacing: 1 }}>
          SAHAYAK ULTRA • GST Suvidha • VLE-IRDAI • MFINS Solar • 🇮🇳
        </div>
      </div>
    </div>
  );
}
