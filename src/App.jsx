import { useState, useRef, useEffect, useCallback } from "react";

const LOGO = "/logo.svg?v=3";
const WA = "https://wa.me/918115776644";

// ── UI Text Config ──
const UI = {
  hindi: {
    appSub: "GST सुविधा • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 बीमा • टैक्स • सोलर — एक ही जगह",
    headline1: "हर वित्तीय समस्या का",
    headline2: "सरल समाधान",
    sub: "बिल्कुल मुफ्त • हिंदी और English • पूरे भारत में",
    solarBanner: "PM सूर्य घर — अभी चेक करें!",
    solarSub: "UP में ₹1,08,000 तक सब्सिडी • मुफ्त सर्वे",
    otherExperts: "अन्य विशेषज्ञ 👇",
    chatOnWA: "सीधे WhatsApp पर बात करें",
    free: "निःशुल्क",
    certified: "सुरक्षित • मुफ्त • VLE-IRDAI प्रमाणित",
    online: "ऑनलाइन • निःशुल्क • पूरे भारत में",
    expert: "विशेषज्ञ",
    askHere: "अपना सवाल लिखें... (हिंदी या English)",
    listen: "सुनें",
    stop: "रोकें",
    callback: "निःशुल्क कॉलबैक पाएं!",
    callbackSub: "हमारे विशेषज्ञ WhatsApp पर संपर्क करेंगे",
    namePlaceholder: "आपका नाम (वैकल्पिक)",
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
  },
  english: {
    appSub: "GST Suvidha • VLE-IRDAI • MFINS Solar",
    tagline: "🇮🇳 INSURANCE • TAX • SOLAR — ONE PLATFORM",
    headline1: "Simple answers to every",
    headline2: "financial question",
    sub: "100% Free • Hindi & English • Pan-India",
    solarBanner: "PM Surya Ghar — Check Now!",
    solarSub: "UP subsidy upto ₹1,08,000 • Free Site Survey",
    otherExperts: "Other Experts 👇",
    chatOnWA: "Chat directly on WhatsApp",
    free: "Free",
    certified: "Safe • Free • VLE-IRDAI Certified",
    online: "Online • Free • Pan-India",
    expert: "Expert",
    askHere: "Ask your question... (Hindi or English)",
    listen: "Listen",
    stop: "Stop",
    callback: "Get Free Expert Callback!",
    callbackSub: "Our expert will reach you on WhatsApp",
    namePlaceholder: "Your name (optional)",
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
  }
};

const AGENTS = {
  hindi: [
    { id:"life", icon:"❤️", name:"जीवन बीमा", tag:"परिवार का भविष्य सुरक्षित करें", color:"#e74c3c", glow:"rgba(231,76,60,0.2)", grad:"135deg,#e74c3c,#7b241c",
      starters:["मुझे कितने का बीमा लेना चाहिए?","टर्म प्लान क्या होता है?","LIC और प्राइवेट में फर्क?"] },
    { id:"health", icon:"🏥", name:"स्वास्थ्य बीमा", tag:"बीमारी का खर्च, बीमा उठाएगा", color:"#27ae60", glow:"rgba(39,174,96,0.2)", grad:"135deg,#27ae60,#145a32",
      starters:["फैमिली फ्लोटर क्या होता है?","आयुष्मान भारत मिलेगा?","पहले से बीमारी कवर होती है?"] },
    { id:"motor", icon:"🚗", name:"मोटर बीमा", tag:"गाड़ी सुरक्षित, मन शांत", color:"#2980b9", glow:"rgba(41,128,185,0.2)", grad:"135deg,#2980b9,#154360",
      starters:["थर्ड पार्टी और कॉम्प्रिहेंसिव में फर्क?","NCB कैसे बचाएं?","ज़ीरो डेप्रिसिएशन लेना चाहिए?"] },
    { id:"crop", icon:"🌾", name:"फसल बीमा", tag:"फसल की सुरक्षा — किसान का अधिकार", color:"#d4a017", glow:"rgba(212,160,23,0.2)", grad:"135deg,#f1c40f,#9a7209",
      starters:["PMFBY में कैसे आवेदन करें?","प्रीमियम कितना लगेगा?","दावा कैसे मिलेगा?"] },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"टैक्स की टेंशन खत्म", color:"#8e44ad", glow:"rgba(142,68,173,0.2)", grad:"135deg,#8e44ad,#4a235a",
      starters:["GST नोटिस आया — क्या करूं?","कौन सा ITR फॉर्म भरें?","टैक्स कैसे बचाएं?"] },
    { id:"loan", icon:"💰", name:"लोन & निवेश", tag:"सही लोन, सही निवेश — आपका हक", color:"#16a085", glow:"rgba(22,160,133,0.2)", grad:"135deg,#1abc9c,#0b5345",
      starters:["होम लोन मिलेगा?","CIBIL स्कोर कैसे बढ़ाएं?","₹5000/माह कहाँ निवेश करें?"] },
    { id:"solar", icon:"☀️", name:"सोलर रूफटॉप", tag:"मुफ्त बिजली, सरकारी सब्सिडी", color:"#f39c12", glow:"rgba(243,156,18,0.25)", grad:"135deg,#f39c12,#a04000", solar:true,
      starters:["UP में कितनी सब्सिडी मिलेगी?","3KW सोलर का खर्च?","EMI पर सोलर मिलेगा?"] },
  ],
  english: [
    { id:"life", icon:"❤️", name:"Life Insurance", tag:"Secure your family's future", color:"#e74c3c", glow:"rgba(231,76,60,0.2)", grad:"135deg,#e74c3c,#7b241c",
      starters:["How much life cover do I need?","What is a term plan?","LIC vs private insurance?"] },
    { id:"health", icon:"🏥", name:"Health Insurance", tag:"Your health, our priority", color:"#27ae60", glow:"rgba(39,174,96,0.2)", grad:"135deg,#27ae60,#145a32",
      starters:["What is a family floater?","Am I eligible for Ayushman Bharat?","Are pre-existing diseases covered?"] },
    { id:"motor", icon:"🚗", name:"Motor Insurance", tag:"Drive safe, stay covered", color:"#2980b9", glow:"rgba(41,128,185,0.2)", grad:"135deg,#2980b9,#154360",
      starters:["Third party vs comprehensive?","How to protect my NCB?","Is zero depreciation worth it?"] },
    { id:"crop", icon:"🌾", name:"Crop Insurance", tag:"Farmer's right — crop protection", color:"#d4a017", glow:"rgba(212,160,23,0.2)", grad:"135deg,#f1c40f,#9a7209",
      starters:["How to apply for PMFBY?","What is the premium amount?","How to file a crop damage claim?"] },
    { id:"gst", icon:"📊", name:"GST & ITR", tag:"No more tax tension", color:"#8e44ad", glow:"rgba(142,68,173,0.2)", grad:"135deg,#8e44ad,#4a235a",
      starters:["Got a GST notice — what to do?","Which ITR form to file?","How to save maximum tax?"] },
    { id:"loan", icon:"💰", name:"Loan & Finance", tag:"Right loan, right investment", color:"#16a085", glow:"rgba(22,160,133,0.2)", grad:"135deg,#1abc9c,#0b5345",
      starters:["Will I get a home loan?","How to improve CIBIL score?","Where to invest ₹5000/month?"] },
    { id:"solar", icon:"☀️", name:"Solar Rooftop", tag:"Free electricity, govt subsidy", color:"#f39c12", glow:"rgba(243,156,18,0.25)", grad:"135deg,#f39c12,#a04000", solar:true,
      starters:["How much subsidy in UP?","Cost of 3KW solar?","Solar on EMI?"] },
  ]
};

// ── Agent domain map ──
const DOMAIN = {
  life: "Life Insurance",
  health: "Health Insurance",
  motor: "Motor Insurance",
  crop: "Crop Insurance & Farmer Schemes",
  gst: "GST Filing, ITR Filing, and Indian Taxation",
  loan: "Loans, CIBIL Score, and Personal Finance",
  solar: "Solar Rooftop"
};

// ── Language Detection ──
function detectLang(t) {
  if (/[\u0900-\u097F]/.test(t)) return "hindi";
  if (/\b(kya|hai|mujhe|mera|aap|nahi|haan|karo|kitna|kaise|kyun|chahiye|batao|bilkul|abhi|toh|aur|ya|se|ke|ka|ki|ko|me|pe|ho|hoga|woh|yeh|sab|bahut|solar|bijli|ghar|bima|loan|agar)\b/i.test(t)) return "hinglish";
  return "english";
}

function langInst(lang) {
  if (lang === "hindi") return "CRITICAL: Respond ENTIRELY in proper Hindi using Devanagari script. Only keep technical terms like GST, ITR, EMI, CIBIL, KW, SIP, FD in English.";
  if (lang === "hinglish") return "CRITICAL: Respond in Hinglish — Hindi (Devanagari) for conversational words, English for technical terms.";
  return "CRITICAL: Respond entirely in clear, professional English.";
}

// ── System Prompts ──
function getSystemPrompt(agentId, lang) {
  const isHindi = lang !== "english";
  const baseInstructions = `You are SAHAYAK — India's trusted AI financial advisor. VLE-IRDAI certified, GST Suvidha Network partner, MFINS Solar Channel Partner, PM Surya Ghar authorized vendor.

RESPONSE STYLE:
- Be CONCISE and POWERFUL. Say more with fewer words.
- Use simple Indian examples: compare insurance premium to "chai ka kharcha", SIP to "piggy bank", etc.
- Give specific numbers, not vague answers.
- Format: 2-3 short paragraphs max. Use bullet points for lists.
- Speak like a trusted elder brother explaining finances — confident, warm, direct male tone.
- In Hindi responses, use masculine form: "main batata hoon", "samjhata hoon" etc.
- NEVER mention any phone number. After 7 exchanges, user will see a WhatsApp button automatically.
- Do NOT say "feel free to ask" or similar filler phrases.

${langInst(isHindi ? "hindi" : "english")}`;

  const domainPrompts = {
    life: `${baseInstructions}\nDOMAIN: Life Insurance expert. Cover term plans, endowment, ULIPs, LIC vs private. Key rule: Term plan = maximum cover, minimum premium. Always ask age, income, dependents.`,
    health: `${baseInstructions}\nDOMAIN: Health Insurance expert. Cover individual, family floater, top-ups, Ayushman Bharat. Key: always check room rent limit, co-payment, network hospitals. Ask family size, existing conditions, city.`,
    motor: `${baseInstructions}\nDOMAIN: Motor Insurance expert. Cover third party vs comprehensive, IDV, NCB, add-ons. Key: zero dep + engine protect = must for new cars. Ask vehicle type, year, current insurer.`,
    crop: `${baseInstructions}\nDOMAIN: Crop Insurance & Farmer Schemes. Cover PMFBY, premium rates, claim process. Use very simple language for farmers. Ask state, crop type, land size.`,
    gst: `${baseInstructions}\nDOMAIN: GST & ITR expert. Cover registration, filing, notices, ITR forms, tax saving, ITR-U. Give step-by-step guidance. Ask specific problem first.`,
    loan: `${baseInstructions}\nDOMAIN: Loan & Personal Finance expert. Cover home loans, personal loans, CIBIL, SIP, FD, PPF, mutual funds. Be realistic with numbers. Ask income, existing loans, goals.`,
    solar: `${baseInstructions}\nDOMAIN: Solar Rooftop expert. PM Surya Ghar vendor + MFINS Solar partner.
SUBSIDY DATA (memorize exactly):
- Central: 1KW=₹30,000 | 2KW=₹60,000 | 3KW+=₹78,000
- UP State extra: 1KW=₹15,000 | 2KW=₹30,000 | 3-10KW=₹30,000
- UP Total: 1KW=₹45,000 | 2KW=₹90,000 | 3KW+=₹1,08,000
- Commercial: No PM Surya Ghar subsidy. 40% depreciation + net metering.
Ask: state, monthly bill, residential/commercial, roof area.`
  };
  return domainPrompts[agentId] || baseInstructions;
}

// ── Solar Calculator ──
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

// ── Text Rendering ──
function renderText(text) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("• ") || line.startsWith("- ")) {
      return <div key={i} style={{display:"flex",gap:6,margin:"2px 0",alignItems:"flex-start"}}>
        <span style={{color:"#a78bfa",marginTop:2,flexShrink:0}}>•</span>
        <span style={{lineHeight:1.7}}>{line.slice(2)}</span>
      </div>;
    }
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <p key={i} style={{margin:"3px 0",lineHeight:1.75}}>{parts.map((p,j)=>j%2===1?<strong key={j} style={{color:"#c4b5fd"}}>{p}</strong>:p)}</p>;
  });
}

// ── Solar Calculator Panel (Messenger Bubble Style) ──
function SolarPanel({ lang, onSend }) {
  const t = UI[lang];
  const [kw, setKw] = useState(2);
  const [state, setState] = useState("UP");
  const [type, setType] = useState("residential");
  const [open, setOpen] = useState(false);
  const calc = calcSolar(kw, state);
  const isComm = type === "commercial";

  const submit = () => {
    const txt = lang === "english"
      ? `Hello! Interested in ${kw}KW ${isComm ? "commercial" : "residential"} solar.%0AState: ${state}${!isComm ? `%0AEst. Subsidy: ₹${calc.total.toLocaleString("en-IN")}` : ""}%0AFrom SAHAYAK App.`
      : `नमस्ते! मुझे ${kw}KW ${isComm ? "व्यावसायिक" : "घरेलू"} सोलर में रुचि है।%0Aराज्य: ${state}${!isComm ? `%0Aअनुमानित सब्सिडी: ₹${calc.total.toLocaleString("en-IN")}` : ""}%0ASAHAYAK App से।`;
    window.open(`${WA}?text=${txt}`, "_blank");
    setOpen(false);
  };

  return (
    <>
      {/* Floating Calculator Bubble */}
      <button onClick={() => setOpen(!open)} style={{
        position:"fixed", bottom:80, right:16, zIndex:100,
        width:52, height:52, borderRadius:"50%",
        background:"linear-gradient(135deg,#f39c12,#d35400)",
        border:"none", cursor:"pointer", fontSize:22,
        boxShadow:"0 4px 20px rgba(243,156,18,0.5)",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"transform 0.2s",
      }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
         onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        🧮
      </button>

      {/* Bottom Sheet Panel */}
      {open && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          background:"#13131f", borderRadius:"20px 20px 0 0",
          border:"1px solid rgba(243,156,18,0.3)",
          padding:"16px 16px 30px",
          boxShadow:"0 -8px 40px rgba(0,0,0,0.6)",
          animation:"slideUp 0.25s ease",
          maxHeight:"85vh", overflowY:"auto",
        }}>
          {/* Handle bar */}
          <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)",margin:"0 auto 14px"}}/>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:800,fontSize:15,color:"#f39c12"}}>☀️ {t.calcTitle}</div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:20,cursor:"pointer"}}>✕</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <div style={{fontSize:11,opacity:0.5,marginBottom:4}}>{t.capacity}</div>
              <select value={kw} onChange={e=>setKw(Number(e.target.value))} style={{width:"100%",padding:"9px 10px",borderRadius:10,border:"1px solid rgba(243,156,18,0.3)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                {[1,2,3,4,5,6,7,8,9,10].map(k=><option key={k} value={k} style={{background:"#13131f"}}>{k} KW</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,opacity:0.5,marginBottom:4}}>{t.state}</div>
              <select value={state} onChange={e=>setState(e.target.value)} style={{width:"100%",padding:"9px 10px",borderRadius:10,border:"1px solid rgba(243,156,18,0.3)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}>
                <option value="UP" style={{background:"#13131f"}}>Uttar Pradesh</option>
                <option value="OTHER" style={{background:"#13131f"}}>Other State</option>
              </select>
            </div>
          </div>

          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["residential","commercial"].map(tp=>(
              <button key={tp} onClick={()=>setType(tp)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:type===tp?"rgba(243,156,18,0.8)":"rgba(255,255,255,0.06)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
                {tp==="residential"?t.home:t.commercial}
              </button>
            ))}
          </div>

          {isComm ? (
            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:12,fontSize:12.5,lineHeight:1.8,opacity:0.75,marginBottom:12,whiteSpace:"pre-line"}}>
              {t.commercialNote}
            </div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {[
                {l:t.centralSub, v:`₹${calc.central.toLocaleString("en-IN")}`, c:"#60a5fa"},
                {l:state==="UP"?t.stateExtra:"State", v:state==="UP"?`₹${calc.stateS.toLocaleString("en-IN")}`:"-", c:"#34d399"},
                {l:t.totalSub, v:`₹${calc.total.toLocaleString("en-IN")}`, c:"#f39c12"},
                {l:t.netCost, v:`₹${calc.net.toLocaleString("en-IN")}`, c:"#f87171"},
                {l:t.annualSaving, v:`₹${calc.saving.toLocaleString("en-IN")}`, c:"#4ade80"},
                {l:t.payback, v:`${calc.payback} ${t.years}`, c:"#c084fc"},
              ].map((item,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:11,padding:"9px 11px",border:`1px solid ${item.c}22`}}>
                  <div style={{fontSize:9.5,opacity:0.45,marginBottom:2}}>{item.l}</div>
                  <div style={{fontSize:15,fontWeight:800,color:item.c}}>{item.v}</div>
                </div>
              ))}
            </div>
          )}

          <button onClick={submit} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f39c12,#d35400)",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit",letterSpacing:0.3}}>
            📱 {t.surveyBtn}
          </button>
        </div>
      )}
      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:199}}/>}
    </>
  );
}

// ── Lead Card ──
function LeadCard({ agent, onSubmit, onSkip, lang }) {
  const t = UI[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const ready = phone.length === 10;

  const submit = () => {
    if (!ready) return;
    const txt = lang === "english"
      ? `Hello! I am ${name || "a user"}.%0ANeed help with ${agent.name}.%0AMobile: ${phone}%0AFrom SAHAYAK App.`
      : `नमस्ते! मैं ${name || "उपयोगकर्ता"} हूँ।%0A${agent.name} के बारे में जानकारी चाहिए।%0AMobile: ${phone}%0ASAHAYAK App से।`;
    window.open(`${WA}?text=${txt}`, "_blank");
    onSubmit(name);
  };

  return (
    <div style={{margin:"4px 0",borderRadius:16,background:`${agent.color}0d`,border:`1px solid ${agent.color}30`,padding:14}}>
      <div style={{fontWeight:800,fontSize:13,color:agent.color,marginBottom:3}}>🎯 {t.callback}</div>
      <div style={{fontSize:11,opacity:0.45,marginBottom:10}}>{t.callbackSub}</div>
      <input placeholder={t.namePlaceholder} value={name} onChange={e=>setName(e.target.value)}
        style={{width:"100%",marginBottom:7,padding:"8px 12px",borderRadius:10,border:`1px solid ${agent.color}30`,background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      <input placeholder={t.phonePlaceholder} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/,"").slice(0,10))} type="tel"
        style={{width:"100%",marginBottom:10,padding:"8px 12px",borderRadius:10,border:`1px solid ${agent.color}30`,background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:7}}>
        <button onClick={submit} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",background:ready?`linear-gradient(${agent.grad})`:"rgba(255,255,255,0.07)",color:"#fff",fontWeight:800,cursor:ready?"pointer":"not-allowed",fontSize:13,fontFamily:"inherit"}}>
          📱 {t.sendWA}
        </button>
        <button onClick={onSkip} style={{padding:"10px 13px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
          {t.later}
        </button>
      </div>
    </div>
  );
}

// ── Main App ──
export default function Sahayak() {
  const [screen, setScreen] = useState("home");
  const [agent, setAgent] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [lang, setLang] = useState("hindi");
  const [speaking, setSpeaking] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const t = UI[lang];
  const agentList = AGENTS[lang];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, showLead]);

  useEffect(() => {
    const agentMsgs = msgs.filter(m => m.role === "assistant").length;
    if (agentMsgs >= 7 && !showLead) setShowLead(true);
  }, [msgs]);

  // Stop speech when changing screen
  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  }, []);

  const openAgent = useCallback((ag) => {
    stopSpeech();
    setAgent(ag);
    setShowLead(false);
    const greeting = lang === "english"
      ? `Hello! I'm your **${ag.name} ${t.expert}** from SAHAYAK! 🙏\n\nAsk me anything — completely **free**. Pick a question or type below! 👇`
      : `नमस्ते! मैं SAHAYAK का **${ag.name} ${t.expert}** हूँ! 🙏\n\nकोई भी सवाल पूछें — **बिल्कुल मुफ्त**। नीचे से चुनें या लिखें! 👇`;
    setMsgs([{ role: "assistant", content: greeting }]);
    setScreen("chat");
  }, [lang, t]);

  // ── Play/Pause TTS ──
  const handleSpeak = (text, idx) => {
    if (speaking === idx) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_]/g, "").replace(/[\u0060]/g, "").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    const targetLang = lang === "english" ? "en-IN" : "hi-IN";
    utt.lang = targetLang;
    // Try to find male voice for gender sync with agent
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v =>
      v.lang.startsWith(lang === "english" ? "en" : "hi") &&
      (v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("man") || v.name.toLowerCase().includes("rajan") || v.name.toLowerCase().includes("hemant"))
    ) || voices.find(v => v.lang.startsWith(lang === "english" ? "en" : "hi"));
    if (maleVoice) utt.voice = maleVoice;
    utt.rate = 0.88;
    utt.pitch = 0.85; // Slightly lower pitch = more masculine
    utt.volume = 1;
    utt.onend = () => setSpeaking(null);
    utt.onerror = () => setSpeaking(null);
    setSpeaking(idx);
    window.speechSynthesis.speak(utt);
  };

  // ── Voice Input ──
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

  // ── Send Message ──
  const send = useCallback(async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");
    stopSpeech();
    const detectedLang = detectLang(q);
    const updated = [...msgs, { role: "user", content: q }];
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
      setMsgs([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMsgs([...updated, { role: "assistant", content: lang === "hindi" ? "नेटवर्क त्रुटि। पुनः प्रयास करें।" : "Network error. Please retry." }]);
    }
    setLoading(false);
  }, [msgs, input, loading, agent, lang]);

  const handleLeadSubmit = (name) => {
    setShowLead(false);
    const msg = lang === "english"
      ? `Thank you${name ? `, ${name}` : ""}! 🙏 Our expert will contact you on WhatsApp soon.`
      : `धन्यवाद${name ? `, ${name} जी` : ""}! 🙏 हमारे विशेषज्ञ जल्द WhatsApp पर संपर्क करेंगे।`;
    setMsgs(prev => [...prev, { role: "assistant", content: msg }]);
  };

  // ── HOME SCREEN ──
  if (screen === "home") return (
    <div style={{ minHeight:"100vh", fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif", background:"#0a0a0f", color:"#e2e8f0", display:"flex", flexDirection:"column", backgroundImage:"radial-gradient(ellipse 80% 40% at 50% 0%,rgba(124,58,237,0.12) 0%,transparent 65%)" }}>

      {/* Header */}
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(124,58,237,0.12)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={LOGO} alt="SAHAYAK" style={{ width:42, height:42, borderRadius:11, objectFit:"cover", boxShadow:"0 0 18px rgba(124,58,237,0.35)" }}/>
          <div>
            <div style={{ fontWeight:900, fontSize:18, letterSpacing:1.5, background:"linear-gradient(90deg,#a78bfa,#fff 50%,#7dd3fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>SAHAYAK</div>
            <div style={{ fontSize:9, opacity:0.35, letterSpacing:0.3 }}>{t.appSub}</div>
          </div>
        </div>
        <div style={{ display:"flex", background:"rgba(124,58,237,0.1)", borderRadius:9, padding:2, border:"1px solid rgba(124,58,237,0.2)" }}>
          {["hindi","english"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:lang===l?"rgba(124,58,237,0.8)":"transparent", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
              {l==="hindi"?"हिंदी":"EN"}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"22px 20px 10px" }}>
        <div style={{ fontSize:11, color:"#a78bfa", fontWeight:700, letterSpacing:1.5, marginBottom:8, opacity:0.85 }}>{t.tagline}</div>
        <h2 style={{ margin:0, fontSize:21, fontWeight:900, lineHeight:1.45, color:"#f1f5f9" }}>
          {t.headline1}<br/><span style={{ color:"#a78bfa" }}>{t.headline2}</span>
        </h2>
        <p style={{ fontSize:11.5, opacity:0.35, marginTop:7 }}>{t.sub}</p>
      </div>

      <div style={{ flex:1, padding:"4px 14px 20px", maxWidth:540, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>

        {/* Solar Banner */}
        <div onClick={() => openAgent(agentList.find(a => a.id === "solar"))} style={{ marginBottom:12, padding:"13px 15px", borderRadius:14, background:"linear-gradient(135deg,rgba(243,156,18,0.1),rgba(211,84,0,0.06))", border:"1px solid rgba(243,156,18,0.2)", cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="linear-gradient(135deg,rgba(243,156,18,0.18),rgba(211,84,0,0.12))"}
          onMouseLeave={e => e.currentTarget.style.background="linear-gradient(135deg,rgba(243,156,18,0.1),rgba(211,84,0,0.06))"}>
          <div style={{ fontSize:28 }}>☀️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:13, color:"#f39c12" }}>{t.solarBanner}</div>
            <div style={{ fontSize:11, opacity:0.5, marginTop:2 }}>{t.solarSub}</div>
          </div>
          <div style={{ fontSize:14, color:"#f39c12", opacity:0.5 }}>→</div>
        </div>

        <p style={{ fontSize:11, opacity:0.28, textAlign:"center", marginBottom:11 }}>{t.otherExperts}</p>

        {/* Agent Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>
          {agentList.filter(a => !a.solar).map((ag, i) => (
            <button key={ag.id} onClick={() => openAgent(ag)} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${ag.color}1a`, borderRadius:14, padding:"14px 8px", cursor:"pointer", textAlign:"center", color:"#e2e8f0", fontFamily:"inherit", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background=`${ag.color}12`; e.currentTarget.style.borderColor=`${ag.color}40`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor=`${ag.color}1a`; e.currentTarget.style.transform=""; }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{ag.icon}</div>
              <div style={{ fontWeight:800, fontSize:10.5, color:ag.color, lineHeight:1.3 }}>{ag.name}</div>
            </button>
          ))}
        </div>

        {/* WhatsApp Button */}
        <a href={WA} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:10, marginTop:11, padding:"11px 15px", borderRadius:13, background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.15)", textDecoration:"none", color:"#e2e8f0", transition:"all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(37,211,102,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(37,211,102,0.06)"}>
          <span style={{ fontSize:18 }}>💬</span>
          <div>
            <div style={{ fontSize:12.5, fontWeight:800, color:"#4ade80" }}>{t.chatOnWA}</div>
            <div style={{ fontSize:10, opacity:0.4 }}>+918115776644 • {t.free}</div>
          </div>
          <span style={{ marginLeft:"auto", fontSize:14, opacity:0.3 }}>→</span>
        </a>

        <div style={{ marginTop:10, padding:"9px 14px", borderRadius:11, background:"rgba(124,58,237,0.05)", border:"1px solid rgba(124,58,237,0.12)", textAlign:"center" }}>
          <span style={{ fontSize:11, color:"#a78bfa", opacity:0.65 }}>🔒 {t.certified}</span>
        </div>
      </div>

      <style>{`
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.3);border-radius:3px}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        select option{background:#13131f;color:#fff}
      `}</style>
    </div>
  );

  // ── CHAT SCREEN ──
  const starters = agent.starters;
  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif", background:"#0a0a0f", color:"#e2e8f0", display:"flex", flexDirection:"column", backgroundImage:`radial-gradient(ellipse 70% 40% at 50% 0%,${agent.glow} 0%,transparent 60%)` }}>

      {/* Chat Header */}
      <div style={{ padding:"9px 13px", display:"flex", alignItems:"center", gap:9, background:"rgba(10,10,15,0.9)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.04)", position:"sticky", top:0, zIndex:10 }}>
        <button onClick={() => { setScreen("home"); stopSpeech(); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", fontSize:20, cursor:"pointer", padding:0, lineHeight:1 }}>←</button>
        <img src={LOGO} alt="s" style={{ width:34, height:34, borderRadius:9, objectFit:"cover", boxShadow:`0 0 12px ${agent.glow}` }}/>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:13, color:"#f1f5f9" }}>{agent.name} {t.expert}</div>
          <div style={{ fontSize:9.5, color:"#4ade80", display:"flex", alignItems:"center", gap:3 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#4ade80", display:"inline-block" }}/>
            {t.online}
          </div>
        </div>
        <a href={`${WA}?text=${lang==="english"?`Hello! Need help with ${agent.name}.`:`नमस्ते! ${agent.name} के बारे में बात करनी है।`}`} target="_blank" rel="noreferrer"
          style={{ background:"#25d366", borderRadius:9, padding:"6px 11px", fontSize:11, color:"#fff", textDecoration:"none", fontWeight:800, whiteSpace:"nowrap" }}>
          📱 WhatsApp
        </a>
      </div>

      {/* Starter Pills */}
      {msgs.length <= 1 && (
        <div style={{ padding:"9px 13px 3px", display:"flex", flexWrap:"wrap", gap:7 }}>
          {starters.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{ background:`${agent.color}0f`, border:`1px solid ${agent.color}28`, borderRadius:20, padding:"6px 13px", color:"rgba(255,255,255,0.8)", cursor:"pointer", fontSize:12, fontFamily:"inherit", transition:"all 0.15s", lineHeight:1.4 }}
              onMouseEnter={e => e.currentTarget.style.background=`${agent.color}22`}
              onMouseLeave={e => e.currentTarget.style.background=`${agent.color}0f`}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"8px 13px", display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:7 }}>
            {msg.role==="assistant" && <img src={LOGO} alt="s" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>}
            <div style={{ maxWidth:"78%" }}>
              <div style={{ background:msg.role==="user"?`linear-gradient(${agent.grad})`:"rgba(255,255,255,0.05)", borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 13px", fontSize:13.5, border:msg.role==="assistant"?"1px solid rgba(255,255,255,0.06)":"none", boxShadow:msg.role==="user"?`0 3px 14px ${agent.glow}`:"none" }}>
                {renderText(msg.content)}
              </div>
              {msg.role==="assistant" && (
                <button onClick={() => handleSpeak(msg.content, i)} style={{
                  marginTop:5, display:"flex", alignItems:"center", gap:5,
                  border:"none", cursor:"pointer", fontFamily:"inherit",
                  borderRadius:22, padding:"5px 12px 5px 8px",
                  background: speaking===i
                    ? `linear-gradient(135deg, ${agent.color}, ${agent.color}99)`
                    : "linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))",
                  boxShadow: speaking===i
                    ? `0 4px 15px ${agent.glow}, 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`
                    : "0 3px 8px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                  transform: speaking===i ? "translateY(1px)" : "translateY(0)",
                  border: speaking===i ? "none" : "1px solid rgba(255,255,255,0.08)",
                  transition:"all 0.18s",
                  color:"#fff",
                }}>
                  <span style={{
                    width:22, height:22, borderRadius:"50%",
                    background: speaking===i ? "rgba(255,255,255,0.2)" : `${agent.color}33`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, flexShrink:0,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                  }}>{speaking===i?"⏸":"▶"}</span>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:0.3, color: speaking===i ? "#fff" : "rgba(255,255,255,0.55)" }}>
                    {speaking===i ? t.stop : t.listen}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}

        {showLead && <LeadCard agent={agent} onSubmit={handleLeadSubmit} onSkip={() => setShowLead(false)} lang={lang}/>}

        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:7 }}>
            <img src={LOGO} alt="s" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover", flexShrink:0 }}/>
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"18px 18px 18px 4px", padding:"11px 15px", display:"flex", gap:4, border:"1px solid rgba(255,255,255,0.06)" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:agent.color, animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Solar Floating Calculator */}
      {agent.solar && <SolarPanel lang={lang} onSend={send}/>}

      {/* Input Bar */}
      <div style={{ padding:"9px 13px 13px", background:"rgba(10,10,15,0.92)", backdropFilter:"blur(16px)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display:"flex", gap:7, alignItems:"flex-end" }}>

          {/* Mic Button - 3D */}
          <button onClick={startVoice} style={{
            width:44, height:44, borderRadius:14, flexShrink:0,
            background: isListening
              ? "linear-gradient(145deg,#ef4444,#b91c1c)"
              : "linear-gradient(145deg,#374151,#1f2937)",
            border: isListening ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.1)",
            cursor:"pointer", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
            animation: isListening ? "pulse 1s infinite" : "none",
            boxShadow: isListening
              ? "0 4px 20px rgba(239,68,68,0.5), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            transform: isListening ? "translateY(1px) scale(0.97)" : "translateY(0) scale(1)",
          }}>
            🎤
          </button>

          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
            placeholder={isListening ? (lang==="hindi"?"बोल रहे हैं...":"Listening...") : t.askHere}
            rows={1} style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${agent.color}25`, borderRadius:13, padding:"10px 13px", color:"#f1f5f9", fontSize:13.5, resize:"none", outline:"none", fontFamily:"inherit", minHeight:42, maxHeight:100, lineHeight:1.5, transition:"border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor=`${agent.color}60`}
            onBlur={e => e.target.style.borderColor=`${agent.color}25`}/>

          {/* Instagram-style Send Button */}
          <button onClick={() => send()} disabled={!input.trim()||loading} style={{
            width:44, height:44, borderRadius:"50%", flexShrink:0,
            background: input.trim()&&!loading
              ? "linear-gradient(145deg,#0ea5e9,#2563eb,#4f46e5)"
              : "linear-gradient(145deg,#1e293b,#0f172a)",
            border: input.trim()&&!loading
              ? "1px solid rgba(99,102,241,0.5)"
              : "1px solid rgba(255,255,255,0.06)",
            cursor: input.trim()&&!loading ? "pointer" : "not-allowed",
            color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
            boxShadow: input.trim()&&!loading
              ? "0 4px 20px rgba(79,70,229,0.5), 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            transform: input.trim()&&!loading ? "translateY(0)" : "translateY(0)",
          }}
          onMouseDown={e=>{ if(input.trim()&&!loading) e.currentTarget.style.transform="translateY(2px) scale(0.95)"; }}
          onMouseUp={e=>e.currentTarget.style.transform="translateY(0) scale(1)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0) scale(1)"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
            </svg>
          </button>
        </div>
        <div style={{ fontSize:9.5, opacity:0.18, textAlign:"center", marginTop:6 }}>SAHAYAK • GST Suvidha • VLE-IRDAI • MFINS Solar • 🇮🇳</div>
      </div>

      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.25);border-radius:3px}
        select option{background:#13131f;color:#fff}
      `}</style>
    </div>
  );
}
