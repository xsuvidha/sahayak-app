import { useState, useRef, useEffect, useCallback } from "react";

const LOGO = "/logo.svg?v=3";
const WA = "https://wa.me/918115776644";
const CONTACT = "+918115776644";

function detectLang(t) {
  if (/[\u0900-\u097F]/.test(t)) return "hindi";
  if (/\b(kya|hai|mujhe|mera|aap|nahi|haan|karo|kitna|kaise|kyun|chahiye|batao|bilkul|abhi|toh|aur|ya|se|ke|ka|ki|ko|me|pe|ho|woh|yeh|sab|bahut|solar|bijli|bima|loan)\b/i.test(t)) return "hinglish";
  return "english";
}

function langInst(lang) {
  if (lang === "hindi") return "CRITICAL: User wrote in Hindi Devanagari. Reply ENTIRELY in Hindi Devanagari script. Only keep GST, ITR, EMI, CIBIL, KW, SIP, FD, PPF in English.";
  if (lang === "hinglish") return "CRITICAL: User wrote Hinglish. Reply in Hinglish - Hindi Devanagari for conversational words, English for technical terms.";
  return "CRITICAL: User wrote English. Reply entirely in clear professional English.";
}

const getBase = (d) => "You are SAHAYAK, India's most trusted AI " + d + " expert. Pan-India. VLE-IRDAI certified, GST Suvidha Network, MFINS Solar Partner, PM Surya Ghar vendor. Warm, practical, clear. Use Rs for amounts. Max 3 short paragraphs. CRITICAL: For any callback, ONLY use WhatsApp " + CONTACT + ". NEVER invent any other phone number.";

const SOLAR_PROMPT = "You are SAHAYAK Solar Rooftop Expert - PM Surya Ghar Authorized Vendor and MFINS Solar Partner. Pan-India. Subsidy: Central: 1KW=30000, 2KW=60000, 3KW+=78000. UP Extra: 1KW=15000, 2KW=30000, 3-10KW=30000. UP Total: 1KW=45000, 2KW=90000, 3KW+=108000. Commercial: no subsidy but 40% depreciation and net metering. Ask state, monthly bill, roof type, residential or commercial. CRITICAL: For callback ONLY use WhatsApp " + CONTACT + ". NEVER mention any other number.";

function calcSolar(kw, state) {
  var central = kw <= 1 ? 30000 : kw <= 2 ? 60000 : 78000;
  var stateS = state === "UP" ? (kw <= 1 ? 15000 : 30000) : 0;
  var total = central + stateS;
  var cost = Math.round(kw * (kw <= 2 ? 67000 : 60000));
  var net = Math.max(0, cost - total);
  var saving = Math.round(kw * 1400 * 7);
  var payback = net > 0 ? (net / saving).toFixed(1) : "0";
  return { central, stateS, total, cost, net, saving, payback };
}

var AGENTS = [
  { id:"life", icon:"❤️", hi:"\u091C\u0940\u0935\u0928 \u092C\u0940\u092E\u093E", en:"Life Insurance", tag:"\u092A\u0930\u093F\u0935\u093E\u0930 \u0915\u093E \u092D\u0935\u093F\u0937\u094D\u092F \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0915\u0930\u0947\u0902", color:"#e74c3c", glow:"rgba(231,76,60,0.25)", grad:"135deg,#e74c3c,#922b21", domain:"Life Insurance",
    starters:{hi:["\u092E\u0941\u091D\u0947 \u0915\u093F\u0924\u0928\u0947 \u0915\u093E \u092C\u0940\u092E\u093E \u0932\u0947\u0928\u093E \u091A\u093E\u0939\u093F\u090F?","\u091F\u0930\u094D\u092E \u092A\u094D\u0932\u093E\u0928 \u0915\u094D\u092F\u093E \u0939\u094B\u0924\u093E \u0939\u0948?","LIC \u0914\u0930 \u092A\u094D\u0930\u093E\u0907\u0935\u0947\u091F \u092E\u0947\u0902 \u092B\u0930\u094D\u0915?"],en:["How much life cover do I need?","What is a term plan?","LIC vs private insurance?"]}},
  { id:"health", icon:"🏥", hi:"\u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u092C\u0940\u092E\u093E", en:"Health Insurance", tag:"\u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u093E \u0916\u0930\u094D\u091A\u093E, \u092C\u0940\u092E\u093E \u0909\u0920\u093E\u090F\u0917\u093E", color:"#27ae60", glow:"rgba(39,174,96,0.25)", grad:"135deg,#27ae60,#1a5e30", domain:"Health Insurance",
    starters:{hi:["\u092B\u0948\u092E\u093F\u0932\u0940 \u092B\u094D\u0932\u094B\u091F\u0930 \u0915\u094D\u092F\u093E \u0939\u094B\u0924\u093E \u0939\u0948?","\u0906\u092F\u0941\u0937\u094D\u092E\u093E\u0928 \u092D\u093E\u0930\u0924 \u092E\u093F\u0932\u0947\u0917\u093E?","\u092A\u0939\u0932\u0947 \u0938\u0947 \u092C\u0940\u092E\u093E\u0930\u0940 \u0915\u0935\u0930 \u0939\u094B\u0924\u0940 \u0939\u0948?"],en:["What is a family floater?","Am I eligible for Ayushman Bharat?","Are pre-existing diseases covered?"]}},
  { id:"motor", icon:"🚗", hi:"\u092E\u094B\u091F\u0930 \u092C\u0940\u092E\u093E", en:"Motor Insurance", tag:"\u0917\u093E\u0921\u093C\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924, \u092E\u0928 \u0936\u093E\u0902\u0924", color:"#2980b9", glow:"rgba(41,128,185,0.25)", grad:"135deg,#2980b9,#1a4a7a", domain:"Motor Insurance",
    starters:{hi:["\u0925\u0930\u094D\u0921 \u092A\u093E\u0930\u094D\u091F\u0940 \u0914\u0930 \u0915\u0949\u092E\u094D\u092A\u094D\u0930\u093F\u0939\u0947\u0902\u0938\u093F\u0935 \u092E\u0947\u0902 \u092B\u0930\u094D\u0915?","NCB \u0915\u0948\u0938\u0947 \u092C\u091A\u093E\u090F\u0902?","\u091C\u093C\u0940\u0930\u094B \u0921\u0947\u092A\u094D\u0930\u093F\u0938\u093F\u090F\u0936\u0928 \u0932\u0947\u0928\u093E \u091A\u093E\u0939\u093F\u090F?"],en:["Third party vs comprehensive?","How to protect NCB?","Is zero depreciation worth it?"]}},
  { id:"crop", icon:"🌾", hi:"\u092B\u0938\u0932 \u092C\u0940\u092E\u093E", en:"Crop Insurance", tag:"\u092B\u0938\u0932 \u0915\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u2014 \u0915\u093F\u0938\u093E\u0928 \u0915\u093E \u0905\u0927\u093F\u0915\u093E\u0930", color:"#d4a017", glow:"rgba(212,160,23,0.25)", grad:"135deg,#f1c40f,#9a7209", domain:"Crop Insurance and Farmer Schemes",
    starters:{hi:["PMFBY \u092E\u0947\u0902 \u0915\u0948\u0938\u0947 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902?","\u092A\u094D\u0930\u0940\u092E\u093F\u092F\u092E \u0915\u093F\u0924\u0928\u093E \u0932\u0917\u0947\u0917\u093E?","\u0926\u093E\u0935\u093E \u0915\u0948\u0938\u0947 \u092E\u093F\u0932\u0947\u0917\u093E?"],en:["How to apply for PMFBY?","What is the premium?","How to file a damage claim?"]}},
  { id:"gst", icon:"📊", hi:"GST & ITR", en:"GST & Tax", tag:"\u091F\u0948\u0915\u094D\u0938 \u0915\u0940 \u091F\u0947\u0902\u0936\u0928 \u0916\u0924\u094D\u092E", color:"#8e44ad", glow:"rgba(142,68,173,0.25)", grad:"135deg,#8e44ad,#5b2c6f", domain:"GST Filing ITR Filing and Indian Taxation",
    starters:{hi:["GST \u0928\u094B\u091F\u093F\u0938 \u0906\u092F\u093E \u2014 \u0915\u094D\u092F\u093E \u0915\u0930\u0942\u0902?","\u0915\u094C\u0928 \u0938\u093E ITR \u092B\u0949\u0930\u094D\u092E \u092D\u0930\u0947\u0902?","\u091F\u0948\u0915\u094D\u0938 \u0915\u0948\u0938\u0947 \u092C\u091A\u093E\u090F\u0902?"],en:["Got a GST notice - what now?","Which ITR form to file?","How to save maximum tax?"]}},
  { id:"loan", icon:"💰", hi:"\u0932\u094B\u0928 & \u0928\u093F\u0935\u0947\u0936", en:"Loan & Finance", tag:"\u0938\u0939\u0940 \u0932\u094B\u0928, \u0938\u0939\u0940 \u0928\u093F\u0935\u0947\u0936 \u2014 \u0906\u092A\u0915\u093E \u0939\u0915", color:"#16a085", glow:"rgba(22,160,133,0.25)", grad:"135deg,#1abc9c,#0e6655", domain:"Loans CIBIL Score and Personal Finance",
    starters:{hi:["\u0939\u094B\u092E \u0932\u094B\u0928 \u092E\u093F\u0932\u0947\u0917\u093E?","CIBIL \u0938\u094D\u0915\u094B\u0930 \u0915\u0948\u0938\u0947 \u092C\u0922\u093C\u093E\u090F\u0902?","5000/\u092E\u093E\u0939 \u0915\u0939\u093E\u0902 \u0928\u093F\u0935\u0947\u0936 \u0915\u0930\u0947\u0902?"],en:["Will I get a home loan?","How to improve CIBIL score?","Where to invest 5000 per month?"]}},
  { id:"solar", icon:"☀️", hi:"\u0938\u094B\u0932\u0930 \u0930\u0942\u092B\u091F\u0949\u092A", en:"Solar Rooftop", tag:"\u092E\u0941\u092B\u094D\u0924 \u092C\u093F\u091C\u0932\u0940, \u0938\u0930\u0915\u093E\u0930\u0940 \u0938\u092C\u094D\u0938\u093F\u0921\u0940", color:"#f39c12", glow:"rgba(243,156,18,0.3)", grad:"135deg,#f39c12,#d35400", domain:"Solar Rooftop", solar:true,
    starters:{hi:["UP \u092E\u0947\u0902 \u0915\u093F\u0924\u0928\u0940 \u0938\u092C\u094D\u0938\u093F\u0921\u0940 \u092E\u093F\u0932\u0947\u0917\u0940?","3KW \u0938\u094B\u0932\u0930 \u0915\u093E \u0916\u0930\u094D\u091A \u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E?","\u0915\u093F\u0930\u093E\u090F \u0915\u0947 \u0918\u0930 \u092E\u0947\u0902 \u0938\u094B\u0932\u0930 \u0932\u0917\u0947\u0917\u093E?"],en:["How much subsidy in UP?","Cost of 3KW solar?","Solar on rented roof?"]}},
];

function cleanText(text) {
  return text.replace(/[*#_]/g, "").trim();
}

function speak(text, lang) {
  window.speechSynthesis.cancel();
  var utt = new SpeechSynthesisUtterance(cleanText(text));
  utt.lang = lang === "english" ? "en-IN" : "hi-IN";
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

function stopSpeak() { window.speechSynthesis.cancel(); }

function renderText(text) {
  return text.split("\n").map(function(line, i) {
    var parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{margin:"3px 0",lineHeight:1.75}}>
        {parts.map(function(p, j) {
          return j % 2 === 1 ? <strong key={j} style={{color:"#fff"}}>{p}</strong> : p;
        })}
      </p>
    );
  });
}

function SolarCalc({ onResult, isH }) {
  const [kw, setKw] = useState(2);
  const [state, setState] = useState("UP");
  const [type, setType] = useState("residential");
  var calc = calcSolar(kw, state);
  var isComm = type === "commercial";
  var ag = AGENTS[6];

  function submit() {
    var txt = isH
      ? "Hello! " + kw + "KW " + (isComm ? "commercial" : "residential") + " solar. State: " + state + (isComm ? "" : " Subsidy: Rs " + calc.total) + " From SAHAYAK."
      : "Hello! " + kw + "KW " + (isComm ? "commercial" : "residential") + " solar. State: " + state + (isComm ? "" : " Subsidy: Rs " + calc.total) + " From SAHAYAK.";
    window.open(WA + "?text=" + encodeURIComponent(txt), "_blank");
    onResult();
  }

  var calcItems = [
    {l: isH ? "Central" : "Central", v: "Rs " + calc.central.toLocaleString("en-IN"), c: "#3498db"},
    {l: state === "UP" ? "UP Extra" : "State", v: state === "UP" ? "Rs " + calc.stateS.toLocaleString("en-IN") : "-", c: "#27ae60"},
    {l: "Total Subsidy", v: "Rs " + calc.total.toLocaleString("en-IN"), c: "#f39c12"},
    {l: "Net Cost", v: "Rs " + calc.net.toLocaleString("en-IN"), c: "#e74c3c"},
    {l: "Annual Saving", v: "Rs " + calc.saving.toLocaleString("en-IN"), c: "#2ecc71"},
    {l: "Payback", v: calc.payback + " yrs", c: "#9b59b6"},
  ];

  return (
    <div style={{margin:"6px 0",borderRadius:16,background:"rgba(243,156,18,0.08)",border:"1px solid rgba(243,156,18,0.25)",padding:14}}>
      <div style={{fontWeight:800,fontSize:13,color:"#f39c12",marginBottom:10}}>☀️ Subsidy Calculator</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <select value={kw} onChange={function(e){setKw(Number(e.target.value));}} style={{padding:"8px 10px",borderRadius:10,border:"1px solid rgba(243,156,18,0.3)",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}>
          {[1,2,3,4,5,6,7,8,9,10].map(function(k){return <option key={k} value={k}>{k} KW</option>;})}
        </select>
        <select value={state} onChange={function(e){setState(e.target.value);}} style={{padding:"8px 10px",borderRadius:10,border:"1px solid rgba(243,156,18,0.3)",background:"rgba(0,0,0,0.5)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit"}}>
          <option value="UP">Uttar Pradesh</option>
          <option value="OTHER">Other State</option>
        </select>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {["residential","commercial"].map(function(t){return(
          <button key={t} onClick={function(){setType(t);}} style={{flex:1,padding:"7px 0",borderRadius:10,border:"none",background:type===t?"rgba(243,156,18,0.8)":"rgba(255,255,255,0.06)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {t === "residential" ? "Home" : "Commercial"}
          </button>
        );})}
      </div>
      {isComm ? (
        <div style={{fontSize:12,opacity:0.6,lineHeight:1.7,marginBottom:10}}>No PM Surya Ghar subsidy for commercial. 40% accelerated depreciation + net metering benefit.</div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
          {calcItems.map(function(item,i){return(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 10px",border:"1px solid " + item.c + "22"}}>
              <div style={{fontSize:9,opacity:0.45,marginBottom:2}}>{item.l}</div>
              <div style={{fontSize:14,fontWeight:800,color:item.c}}>{item.v}</div>
            </div>
          );})}
        </div>
      )}
      <button onClick={submit} style={{width:"100%",padding:"10px 0",borderRadius:11,border:"none",background:"linear-gradient(" + ag.grad + ")",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
        📱 WhatsApp for Free Site Survey
      </button>
    </div>
  );
}

function LeadCard({ agent, onSubmit, onSkip, isH }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  var ready = phone.length === 10;

  function submit() {
    if (!ready) return;
    var txt = "Hello! I am " + (name || "a user") + ". Need help with " + agent.en + ". Mobile: " + phone + ". From SAHAYAK App.";
    window.open(WA + "?text=" + encodeURIComponent(txt), "_blank");
    onSubmit(name);
  }

  return (
    <div style={{margin:"4px 0",borderRadius:16,background:agent.color + "0d",border:"1px solid " + agent.color + "30",padding:14}}>
      <div style={{fontWeight:800,fontSize:13,color:agent.color,marginBottom:4}}>🎯 Free Expert Callback!</div>
      <div style={{fontSize:11,opacity:0.45,marginBottom:10}}>Our expert will reach you on WhatsApp</div>
      <input placeholder="Your name (optional)" value={name} onChange={function(e){setName(e.target.value);}} style={{width:"100%",marginBottom:7,padding:"8px 12px",borderRadius:10,border:"1px solid " + agent.color + "30",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      <input placeholder="Mobile number (10 digits)" value={phone} onChange={function(e){setPhone(e.target.value.replace(/\D/g,"").slice(0,10));}} type="tel" style={{width:"100%",marginBottom:10,padding:"8px 12px",borderRadius:10,border:"1px solid " + agent.color + "30",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:7}}>
        <button onClick={submit} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",background:ready ? "linear-gradient(" + agent.grad + ")" : "rgba(255,255,255,0.07)",color:"#fff",fontWeight:800,cursor:ready?"pointer":"not-allowed",fontSize:13,fontFamily:"inherit"}}>
          📱 Send on WhatsApp
        </button>
        <button onClick={onSkip} style={{padding:"10px 13px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Later</button>
      </div>
    </div>
  );
}

export default function Sahayak() {
  const [screen, setScreen] = useState("home");
  const [agent, setAgent] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [lang, setLang] = useState("hindi");
  const [speaking, setSpeaking] = useState(null);
  const endRef = useRef(null);
  var isH = lang !== "english";

  useEffect(function() { endRef.current && endRef.current.scrollIntoView({behavior:"smooth"}); }, [msgs, showLead, showCalc]);

  useEffect(function() {
    var u = msgs.filter(function(m){return m.role==="user";}).length;
    if (u >= 7 && !showLead) setShowLead(true);
    if (agent && agent.solar && u === 1 && !showCalc) setShowCalc(true);
  }, [msgs]);

  function openAgent(ag) {
    setAgent(ag); setSpeaking(null); stopSpeak();
    var welcome = ag.solar
      ? "Hello! I am SAHAYAK Solar Rooftop Expert! PM Surya Ghar Authorized Vendor + MFINS Solar Partner. Pan-India service.\n\nUse the calculator below or ask me anything!"
      : "Hello! I am your " + ag.en + " Expert from SAHAYAK!\n\nAsk me anything — completely free. Pick a question or type below!";
    setMsgs([{role:"assistant", content: welcome}]);
    setShowLead(false); setShowCalc(false); setScreen("chat");
  }

  function handleSpeak(text, idx) {
    if (speaking === idx) { stopSpeak(); setSpeaking(null); }
    else { speak(text, lang); setSpeaking(idx); }
  }

  async function send(text) {
    var q = text || input.trim();
    if (!q || loading) return;
    setInput(""); stopSpeak(); setSpeaking(null);
    var detectedLang = detectLang(q);
    var updated = [...msgs, {role:"user", content:q}];
    setMsgs(updated); setLoading(true);
    try {
      var sys = (agent.solar ? SOLAR_PROMPT : getBase(agent.domain)) + "\n\n" + langInst(detectedLang);
      var res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({system:sys, messages:updated.map(function(m){return {role:m.role, content:m.content};})})
      });
      var data = await res.json();
      var reply = data && data.content ? data.content.map(function(c){return c.text||"";}).join("") : "Please try again.";
      setMsgs([...updated, {role:"assistant", content:reply}]);
    } catch(e) {
      setMsgs([...updated, {role:"assistant", content:"Network error. Please try again."}]);
    }
    setLoading(false);
  }

  if (screen === "home") return (
    <div style={{minHeight:"100vh",fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif",background:"#080810",color:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src={LOGO} alt="SAHAYAK" onError={function(e){e.target.style.display="none";}} style={{width:44,height:44,borderRadius:11,objectFit:"cover",boxShadow:"0 0 20px rgba(255,153,0,0.25)"}}/>
          <div>
            <div style={{fontWeight:900,fontSize:18,letterSpacing:2,background:"linear-gradient(90deg,#ff9900,#fff 55%,#138808)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SAHAYAK</div>
            <div style={{fontSize:9,opacity:0.35}}>GST Suvidha | VLE-IRDAI | MFINS Solar</div>
          </div>
        </div>
        <div style={{display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:9,padding:2,border:"1px solid rgba(255,255,255,0.08)"}}>
          {["hindi","english"].map(function(l){return(
            <button key={l} onClick={function(){setLang(l);}} style={{padding:"5px 11px",borderRadius:7,border:"none",background:lang===l?"rgba(255,153,0,0.8)":"transparent",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              {l==="hindi" ? "Hindi" : "EN"}
            </button>
          );})}
        </div>
      </div>

      <div style={{textAlign:"center",padding:"20px 20px 10px"}}>
        <div style={{fontSize:11,color:"#ff9900",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>
          {isH ? "INSURANCE | TAX | SOLAR — EK HI JAGAH" : "INSURANCE | TAX | SOLAR — ONE PLATFORM"}
        </div>
        <h2 style={{margin:0,fontSize:20,fontWeight:900,lineHeight:1.45}}>
          {isH ? "Har financial problem ka" : "Simple answers to every"}
          <br/><span style={{color:"#ff9900"}}>{isH ? "saral samadhan" : "financial question"}</span>
        </h2>
        <p style={{fontSize:11.5,opacity:0.35,marginTop:7}}>{isH ? "Bilkul muft | Hindi aur English | Pure Bharat mein" : "100% Free | Hindi & English | Pan-India"}</p>
      </div>

      <div style={{flex:1,padding:"4px 14px 18px",maxWidth:540,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
        <div onClick={function(){openAgent(AGENTS[6]);}} style={{marginBottom:12,padding:"13px 15px",borderRadius:15,background:"rgba(243,156,18,0.1)",border:"1px solid rgba(243,156,18,0.25)",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:30}}>☀️</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:13,color:"#f39c12"}}>PM Surya Ghar — Check Now!</div>
            <div style={{fontSize:11,opacity:0.5,marginTop:2}}>UP subsidy upto Rs 1,08,000 | Free Site Survey</div>
          </div>
          <div style={{fontSize:16,color:"#f39c12",opacity:0.5}}>{">"}</div>
        </div>

        <p style={{fontSize:11,opacity:0.3,textAlign:"center",marginBottom:11}}>{isH ? "Other Experts:" : "Other Experts:"}</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
          {AGENTS.filter(function(a){return !a.solar;}).map(function(ag,i){return(
            <button key={ag.id} onClick={function(){openAgent(ag);}} style={{background:"rgba(255,255,255,0.03)",border:"1px solid " + ag.color + "20",borderRadius:15,padding:"14px 8px",cursor:"pointer",textAlign:"center",color:"#fff",fontFamily:"inherit"}}>
              <div style={{fontSize:22,marginBottom:6}}>{ag.icon}</div>
              <div style={{fontWeight:800,fontSize:10.5,color:ag.color,lineHeight:1.3}}>{ag.hi}</div>
            </button>
          );})}
        </div>

        <a href={WA} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:10,marginTop:11,padding:"11px 15px",borderRadius:13,background:"rgba(37,211,102,0.06)",border:"1px solid rgba(37,211,102,0.18)",textDecoration:"none",color:"#fff"}}>
          <span style={{fontSize:18}}>💬</span>
          <div>
            <div style={{fontSize:12.5,fontWeight:800,color:"#25d366"}}>Chat on WhatsApp</div>
            <div style={{fontSize:10,opacity:0.4}}>+918115776644 | Free</div>
          </div>
          <span style={{marginLeft:"auto",fontSize:14,opacity:0.35}}>{">"}</span>
        </a>
      </div>
    </div>
  );

  var starters = agent.starters[isH ? "hi" : "en"];
  return (
    <div style={{minHeight:"100vh",fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif",background:"#080810",color:"#fff",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"9px 13px",display:"flex",alignItems:"center",gap:9,background:"rgba(8,8,16,0.9)",borderBottom:"1px solid rgba(255,255,255,0.03)",position:"sticky",top:0,zIndex:10}}>
        <button onClick={function(){setScreen("home");stopSpeak();setSpeaking(null);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.55)",fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>{"<"}</button>
        <img src={LOGO} alt="s" onError={function(e){e.target.style.display="none";}} style={{width:36,height:36,borderRadius:9,objectFit:"cover"}}/>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:13}}>{agent.en} Expert</div>
          <div style={{fontSize:9.5,color:"#2ecc71"}}>● Online | Free | Pan-India</div>
        </div>
        <a href={WA + "?text=Hello! Need help with " + agent.en + "."} target="_blank" rel="noreferrer" style={{background:"#25d366",borderRadius:9,padding:"6px 11px",fontSize:11,color:"#fff",textDecoration:"none",fontWeight:800}}>📱 WhatsApp</a>
      </div>

      {msgs.length <= 1 && (
        <div style={{padding:"9px 13px 3px",display:"flex",flexWrap:"wrap",gap:7}}>
          {starters.map(function(q,i){return(
            <button key={i} onClick={function(){send(q);}} style={{background:agent.color + "12",border:"1px solid " + agent.color + "30",borderRadius:20,padding:"6px 13px",color:"rgba(255,255,255,0.85)",cursor:"pointer",fontSize:12,fontFamily:"inherit",lineHeight:1.4}}>{q}</button>
          );})}
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:"8px 13px",display:"flex",flexDirection:"column",gap:9}}>
        {msgs.map(function(msg,i){return(
          <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:7}}>
            {msg.role==="assistant" && <img src={LOGO} alt="s" onError={function(e){e.target.style.display="none";}} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>}
            <div style={{maxWidth:"78%"}}>
              <div style={{background:msg.role==="user" ? "linear-gradient(" + agent.grad + ")" : "rgba(255,255,255,0.055)",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 13px",fontSize:13.5,border:msg.role==="assistant"?"1px solid rgba(255,255,255,0.07)":"none"}}>
                {renderText(msg.content)}
              </div>
              {msg.role==="assistant" && (
                <button onClick={function(){handleSpeak(msg.content,i);}} style={{marginTop:4,display:"flex",alignItems:"center",gap:4,background:"none",border:"none",color:speaking===i?agent.color:"rgba(255,255,255,0.3)",cursor:"pointer",fontSize:11,padding:"2px 4px",fontFamily:"inherit"}}>
                  {speaking === i ? "Stop" : "🔊 Listen"}
                </button>
              )}
            </div>
          </div>
        );})}

        {showCalc && agent.solar && (
          <SolarCalc onResult={function(){setShowCalc(false);setMsgs(function(prev){return [...prev,{role:"assistant",content:"Details sent on WhatsApp! Our expert will contact you soon for free site survey."}];});}} isH={isH}/>
        )}
        {showLead && (
          <LeadCard agent={agent} onSubmit={function(n){setShowLead(false);setMsgs(function(prev){return [...prev,{role:"assistant",content:"Thank you" + (n?", "+n:"") + "! Our expert will contact you on WhatsApp soon."}];});}} onSkip={function(){setShowLead(false);}} isH={isH}/>
        )}

        {loading && (
          <div style={{display:"flex",alignItems:"flex-end",gap:7}}>
            <img src={LOGO} alt="s" onError={function(e){e.target.style.display="none";}} style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
            <div style={{background:"rgba(255,255,255,0.055)",borderRadius:"18px 18px 18px 4px",padding:"11px 15px",display:"flex",gap:4,border:"1px solid rgba(255,255,255,0.04)"}}>
              {[0,1,2].map(function(i){return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:agent.color,animation:"bounce 1.2s " + (i*0.2) + "s infinite"}}/>;})}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div style={{padding:"9px 13px 13px",background:"rgba(8,8,16,0.9)",borderTop:"1px solid rgba(255,255,255,0.03)"}}>
        <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
          <textarea value={input} onChange={function(e){setInput(e.target.value);}}
            onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={isH ? "Apna sawaal likhein... (Hindi ya English)" : "Ask your question... (Hindi or English)"}
            rows={1} style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid " + agent.color + "28",borderRadius:13,padding:"10px 13px",color:"#fff",fontSize:13.5,resize:"none",outline:"none",fontFamily:"inherit",minHeight:42,maxHeight:100,lineHeight:1.5}}/>
          <button onClick={function(){send();}} disabled={!input.trim()||loading} style={{width:42,height:42,borderRadius:12,flexShrink:0,background:input.trim()&&!loading ? "linear-gradient(" + agent.grad + ")" : "rgba(255,255,255,0.05)",border:"none",cursor:input.trim()&&!loading?"pointer":"not-allowed",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{">"}</button>
        </div>
        <div style={{fontSize:9.5,opacity:0.2,textAlign:"center",marginTop:6}}>SAHAYAK | GST Suvidha | VLE-IRDAI | MFINS Solar</div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        textarea::placeholder, input::placeholder { color: rgba(255,255,255,0.22); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
}
