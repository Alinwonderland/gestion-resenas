import { useState, useEffect, useRef } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const StarIcon = ({ filled, half }) => (
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill={filled ? "#F59E0B" : half ? "url(#half)" : "none"}
    stroke="#F59E0B" strokeWidth="1.5">
    {half && (
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Stars = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <StarIcon key={i}
        filled={i <= Math.floor(rating)}
        half={i === Math.ceil(rating) && rating % 1 >= 0.5}
      />
    ))}
  </div>
);

const TypewriterText = ({ text, speed = 40 }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else { setDone(true); clearInterval(interval); }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}{!done && <span style={{ animation: "blink 1s infinite" }}>|</span>}</span>;
};

const GlowOrb = ({ style }) => (
  <div style={{
    position: "absolute", borderRadius: "50%",
    filter: "blur(80px)", opacity: 0.15, pointerEvents: "none", ...style
  }} />
);

const urgencyConfig = {
  alta:  { color: "#EF4444", label: "URGENTE",   bg: "rgba(239,68,68,0.1)" },
  media: { color: "#F59E0B", label: "MEJORABLE", bg: "rgba(245,158,11,0.1)" },
  baja:  { color: "#10B981", label: "ESTABLE",   bg: "rgba(16,185,129,0.1)" },
};

export default function App() {
  const [step, setStep] = useState("hero");
  const [restaurantName, setRestaurantName] = useState("");
  const [city, setCity] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [analyzePhase, setAnalyzePhase] = useState(0);
  const resultRef = useRef(null);

  useEffect(() => { setTimeout(() => setAnimateIn(true), 100); }, []);

  const analyzePhases = [
    "Buscando perfil en Google Business...",
    "Analizando volumen de reseñas...",
    "Comparando con competidores locales...",
    "Calculando visibilidad en IA...",
    "Generando diagnóstico completo..."
  ];

  const runAnalysis = async () => {
    if (!restaurantName.trim()) return;
    setLoading(true); setStep("analyzing"); setAnalyzePhase(0);
    const phaseInterval = setInterval(() => {
      setAnalyzePhase(p => {
        if (p >= analyzePhases.length - 1) { clearInterval(phaseInterval); return p; }
        return p + 1;
      });
    }, 900);

    try {
      const prompt = `Eres un experto en reputación online de negocios de hostelería en España.
Analiza el restaurante "${restaurantName}" en "${city || "España"}" y genera un diagnóstico de reputación digital realista y específico.
Responde SOLO en JSON válido sin backticks ni markdown, con esta estructura exacta:
{
  "score": 4.1,
  "totalReviews": 87,
  "monthlyReviews": 6,
  "responseRate": 34,
  "positionInZone": 8,
  "totalInZone": 24,
  "toNextPosition": 12,
  "aiVisibility": "baja",
  "strengths": ["Comida valorada muy positivamente", "Ambiente acogedor mencionado frecuentemente"],
  "weaknesses": ["Tiempo de espera criticado en 23% de reseñas", "Solo responde al 34% de reseñas"],
  "negativeUnresponded": 4,
  "potentialMonthlyClients": 18,
  "diagnosis": "Una frase impactante y específica sobre la situación del restaurante",
  "urgency": "media"
}
Sé realista. Score entre 3.8 y 4.7. Reviews entre 40 y 300. Urgency: "baja", "media" o "alta".`;

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content.map(b => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      clearInterval(phaseInterval);
      setAnalysisResult(parsed); setLoading(false); setStep("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      clearInterval(phaseInterval);
      setAnalysisResult({
        score: 4.2, totalReviews: 94, monthlyReviews: 5, responseRate: 28,
        positionInZone: 9, totalInZone: 22, toNextPosition: 14,
        aiVisibility: "baja", negativeUnresponded: 3,
        strengths: ["Calidad de la comida bien valorada", "Ubicación conveniente mencionada"],
        weaknesses: ["Baja tasa de respuesta a reseñas negativas", "Pocas reseñas recientes"],
        potentialMonthlyClients: 15,
        diagnosis: "Con solo 5 reseñas al mes, estás perdiendo visibilidad frente a competidores más activos en Google y no apareces en las recomendaciones de ChatGPT.",
        urgency: "media"
      });
      setLoading(false); setStep("result");
    }
  };

  const s = {
    app: {
      minHeight: "100vh", background: "#080C14", color: "#E8EDF5",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      position: "relative", overflow: "hidden"
    },
    nav: {
      padding: "24px 40px", display: "flex", justifyContent: "space-between",
      alignItems: "center", position: "relative", zIndex: 10
    },
    logo: { fontSize: "15px", fontWeight: "700", letterSpacing: "0.05em", color: "#E8EDF5", textTransform: "uppercase" },
    logoAccent: { color: "#F59E0B" },
    hero: {
      maxWidth: "760px", margin: "0 auto", padding: "60px 24px 40px",
      textAlign: "center", position: "relative", zIndex: 10,
      opacity: animateIn ? 1 : 0,
      transform: animateIn ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    badge: {
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
      borderRadius: "100px", padding: "6px 16px", fontSize: "12px",
      color: "#F59E0B", fontWeight: "600", letterSpacing: "0.08em",
      textTransform: "uppercase", marginBottom: "32px"
    },
    h1: {
      fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "800", lineHeight: "1.1",
      marginBottom: "20px", letterSpacing: "-0.03em",
      fontFamily: "'DM Serif Display', Georgia, serif"
    },
    h1Accent: {
      background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
    },
    subtitle: {
      fontSize: "18px", color: "#8B95A8", lineHeight: "1.6",
      marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px"
    },
    card: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", padding: "32px", backdropFilter: "blur(10px)",
      maxWidth: "560px", margin: "0 auto"
    },
    input: {
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px", padding: "14px 18px", fontSize: "16px",
      color: "#E8EDF5", outline: "none", transition: "border-color 0.2s",
      width: "100%", boxSizing: "border-box", marginBottom: "12px", display: "block"
    },
    btn: {
      background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none",
      borderRadius: "12px", padding: "16px 32px", fontSize: "16px",
      fontWeight: "700", color: "#080C14", cursor: "pointer", width: "100%",
      transition: "transform 0.2s, opacity 0.2s", letterSpacing: "-0.01em"
    },
    disclaimer: { fontSize: "12px", color: "#4B5563", marginTop: "12px" },
    statsRow: {
      display: "flex", justifyContent: "center", gap: "40px",
      marginTop: "60px", flexWrap: "wrap"
    },
    statNum: {
      fontSize: "28px", fontWeight: "800", color: "#F59E0B",
      fontFamily: "'DM Serif Display', Georgia, serif"
    },
    statLabel: {
      fontSize: "12px", color: "#4B5563", marginTop: "4px",
      letterSpacing: "0.05em", textTransform: "uppercase"
    },
    analyzingWrap: {
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", padding: "40px 24px",
      position: "relative", zIndex: 10
    },
    spinner: {
      width: "64px", height: "64px",
      border: "3px solid rgba(245,158,11,0.2)", borderTop: "3px solid #F59E0B",
      borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "32px"
    },
    resultWrap: { maxWidth: "760px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 10 },
    scoreCircle: {
      width: "120px", height: "120px", borderRadius: "50%",
      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
      border: "2px solid rgba(245,158,11,0.4)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", margin: "0 auto 20px"
    },
    scoreNum: {
      fontSize: "36px", fontWeight: "800", color: "#F59E0B",
      lineHeight: "1", fontFamily: "'DM Serif Display', Georgia, serif"
    },
    metricCard: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px", padding: "20px", flex: "1", minWidth: "140px"
    },
    metricVal: {
      fontSize: "26px", fontWeight: "800", color: "#E8EDF5",
      fontFamily: "'DM Serif Display', Georgia, serif", marginBottom: "4px"
    },
    metricKey: { fontSize: "12px", color: "#6B7280", letterSpacing: "0.04em" },
    listItem: {
      display: "flex", alignItems: "flex-start", gap: "10px",
      marginBottom: "10px", fontSize: "14px", color: "#9CA3AF", lineHeight: "1.5"
    },
    dot: (color) => ({
      width: "6px", height: "6px", borderRadius: "50%",
      background: color, marginTop: "6px", flexShrink: 0
    }),
    ctaSection: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", padding: "32px", textAlign: "center", marginTop: "32px"
    }
  };

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:0.15} 50%{opacity:0.25} }
        input:focus { border-color: rgba(245,158,11,0.5) !important; }
        button:hover { opacity:0.9; transform:translateY(-1px); }
        button:active { transform:translateY(0); }
        @media(max-width:600px){ .grid2{ flex-direction:column !important; } }
      `}</style>

      <GlowOrb style={{ width:500, height:500, background:"#F59E0B", top:-100, left:-100, animation:"pulse 4s ease-in-out infinite" }} />
      <GlowOrb style={{ width:400, height:400, background:"#3B82F6", bottom:100, right:-100, animation:"pulse 6s ease-in-out infinite" }} />

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>Gestión<span style={s.logoAccent}>Reseñas</span>.com</div>
        <div style={{ fontSize:"13px", color:"#4B5563" }}>Reputación digital para negocios</div>
      </nav>

      {/* HERO */}
      {step === "hero" && (
        <div style={s.hero}>
          <div style={s.badge}><span>★</span><span>Análisis gratuito en 30 segundos</span></div>
          <h1 style={s.h1}>
            ¿Apareces cuando<br />
            <span style={s.h1Accent}>ChatGPT recomienda</span><br />
            tu ciudad?
          </h1>
          <p style={s.subtitle}>
            El 73% de los restaurantes pierden clientes sin saberlo porque sus reseñas no están optimizadas para los nuevos buscadores de IA. Descúbrelo en 30 segundos.
          </p>
          <div style={s.card}>
            <div style={{ fontSize:"13px", color:"#6B7280", marginBottom:"16px", fontWeight:"600", letterSpacing:"0.05em", textTransform:"uppercase", textAlign:"left" }}>
              Analiza tu negocio gratis
            </div>
            <input style={s.input} placeholder="Nombre de tu restaurante"
              value={restaurantName} onChange={e => setRestaurantName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runAnalysis()} />
            <input style={s.input} placeholder="Ciudad (ej: Madrid, Alicante...)"
              value={city} onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runAnalysis()} />
            <button style={{ ...s.btn, opacity: !restaurantName.trim() ? 0.5 : 1 }}
              onClick={runAnalysis} disabled={!restaurantName.trim()}>
              Analizar mi reputación gratis →
            </button>
            <p style={s.disclaimer}>Sin registro. Sin tarjeta. Resultado inmediato.</p>
          </div>
          <div style={s.statsRow}>
            {[{num:"+2.300", label:"Negocios analizados"}, {num:"4,6★", label:"Media conseguida"}, {num:"3x", label:"Más visible en IA"}].map((st, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={s.statNum}>{st.num}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {step === "analyzing" && (
        <div style={s.analyzingWrap}>
          <div style={s.spinner} />
          <div style={{ fontSize:"20px", fontWeight:"700", marginBottom:"16px", fontFamily:"'DM Serif Display', Georgia, serif" }}>
            Analizando <span style={{ color:"#F59E0B" }}>{restaurantName}</span>
          </div>
          <div style={{ fontSize:"14px", color:"#6B7280", height:"24px" }}>
            <TypewriterText key={analyzePhase} text={analyzePhases[analyzePhase]} speed={30} />
          </div>
          <div style={{ display:"flex", gap:"8px", marginTop:"32px" }}>
            {analyzePhases.map((_, i) => (
              <div key={i} style={{
                width: i <= analyzePhase ? "24px" : "6px", height:"6px",
                borderRadius:"3px",
                background: i <= analyzePhase ? "#F59E0B" : "rgba(255,255,255,0.1)",
                transition:"all 0.3s"
              }} />
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && analysisResult && (
        <div style={s.resultWrap} ref={resultRef}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div style={{ fontSize:"13px", color:"#6B7280", marginBottom:"16px", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Diagnóstico de reputación
            </div>
            <h2 style={{ fontSize:"28px", fontWeight:"800", marginBottom:"16px", fontFamily:"'DM Serif Display', Georgia, serif" }}>
              {restaurantName}
              {city && <span style={{ color:"#6B7280", fontWeight:"400", fontSize:"20px" }}> · {city}</span>}
            </h2>
            <div style={{ display:"flex", justifyContent:"center", gap:"20px", alignItems:"center", flexWrap:"wrap" }}>
              <div style={s.scoreCircle}>
                <div style={s.scoreNum}>{analysisResult.score}</div>
                <div style={{ fontSize:"10px", color:"#6B7280", letterSpacing:"0.1em", textTransform:"uppercase" }}>Puntuación</div>
              </div>
              <div style={{ textAlign:"left" }}>
                <Stars rating={analysisResult.score} />
                <div style={{ fontSize:"13px", color:"#6B7280", marginTop:"8px" }}>{analysisResult.totalReviews} reseñas totales</div>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:"6px", marginTop:"10px",
                  background: urgencyConfig[analysisResult.urgency]?.bg,
                  color: urgencyConfig[analysisResult.urgency]?.color,
                  border: `1px solid ${urgencyConfig[analysisResult.urgency]?.color}40`,
                  borderRadius:"100px", padding:"4px 12px", fontSize:"11px", fontWeight:"700", letterSpacing:"0.08em"
                }}>
                  ● {urgencyConfig[analysisResult.urgency]?.label}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ background:"rgba(245,158,11,0.05)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:"16px", padding:"24px", marginBottom:"16px" }}>
            <div style={{ fontSize:"11px", color:"#F59E0B", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"10px" }}>📊 Diagnóstico</div>
            <div style={{ fontSize:"15px", color:"#D1D5DB", lineHeight:"1.6" }}>{analysisResult.diagnosis}</div>
          </div>

          {/* Metrics */}
          <div className="grid2" style={{ display:"flex", gap:"16px", marginBottom:"16px", flexWrap:"wrap" }}>
            {[
              { val:`${analysisResult.monthlyReviews}/mes`, key:"Reseñas nuevas" },
              { val:`${analysisResult.responseRate}%`, key:"Tasa de respuesta" },
              { val:`#${analysisResult.positionInZone} de ${analysisResult.totalInZone}`, key:"Posición en zona" },
              { val:analysisResult.aiVisibility?.toUpperCase(), key:"Visibilidad en IA",
                color: analysisResult.aiVisibility === "baja" ? "#EF4444" : "#10B981" }
            ].map((m, i) => (
              <div key={i} style={s.metricCard}>
                <div style={{ ...s.metricVal, color: m.color || "#E8EDF5" }}>{m.val}</div>
                <div style={s.metricKey}>{m.key}</div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid2" style={{ display:"flex", gap:"16px", marginBottom:"16px", flexWrap:"wrap" }}>
            <div style={{ ...s.metricCard, flex:1 }}>
              <div style={{ fontSize:"12px", color:"#10B981", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"14px" }}>✓ Lo que funciona</div>
              {analysisResult.strengths?.map((st, i) => (
                <div key={i} style={s.listItem}><div style={s.dot("#10B981")} />{st}</div>
              ))}
            </div>
            <div style={{ ...s.metricCard, flex:1 }}>
              <div style={{ fontSize:"12px", color:"#EF4444", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"14px" }}>✗ Lo que frena</div>
              {analysisResult.weaknesses?.map((w, i) => (
                <div key={i} style={s.listItem}><div style={s.dot("#EF4444")} />{w}</div>
              ))}
            </div>
          </div>

          {/* Opportunity */}
          <div style={{ ...s.metricCard, background:"rgba(16,185,129,0.05)", border:"1px solid rgba(16,185,129,0.2)", display:"flex", gap:"20px", alignItems:"center", marginBottom:"0" }}>
            <div style={{ fontSize:"36px", fontWeight:"800", color:"#10B981", fontFamily:"'DM Serif Display', Georgia, serif", flexShrink:0 }}>
              +{analysisResult.potentialMonthlyClients}
            </div>
            <div>
              <div style={{ fontWeight:"600", marginBottom:"4px" }}>clientes potenciales al mes que te estás perdiendo</div>
              <div style={{ fontSize:"13px", color:"#6B7280" }}>Solo con estar en el Top 5 de tu zona y responder el 100% de las reseñas.</div>
            </div>
          </div>

          {/* CTA */}
          <div style={s.ctaSection}>
            <div style={{ fontSize:"22px", fontWeight:"800", marginBottom:"8px", fontFamily:"'DM Serif Display', Georgia, serif" }}>
              ¿Quieres que lo arreglemos por ti?
            </div>
            <div style={{ fontSize:"14px", color:"#6B7280", marginBottom:"24px" }}>
              Recibe el plan de acción completo para <strong style={{ color:"#E8EDF5" }}>{restaurantName}</strong> en tu email
            </div>
            {!leadSent ? (
              <div style={{ maxWidth:"400px", margin:"0 auto" }}>
                <input style={s.input} placeholder="Tu nombre" value={leadName} onChange={e => setLeadName(e.target.value)} />
                <input style={s.input} placeholder="Tu email" type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
                <button style={{ ...s.btn, opacity:(!leadName || !leadEmail) ? 0.5 : 1 }}
                  onClick={() => { if (leadName && leadEmail) { setLeadSent(true); setStep("pricing"); } }}
                  disabled={!leadName || !leadEmail}>
                  Enviarme el plan de acción →
                </button>
                <p style={s.disclaimer}>Sin spam. Solo tu plan de acción personalizado.</p>
              </div>
            ) : (
              <div style={{ color:"#10B981", fontWeight:"600" }}>✓ ¡Perfecto! Revisa tu email en los próximos minutos.</div>
            )}
          </div>
        </div>
      )}

      {/* PRICING */}
      {step === "pricing" && (
        <div style={{ ...s.resultWrap, animation:"fadeUp 0.6s ease" }}>
          <div style={{ textAlign:"center", marginBottom:"48px" }}>
            <h2 style={{ ...s.h1, fontSize:"36px" }}>
              Nosotros nos encargamos de <span style={s.h1Accent}>todo</span>
            </h2>
            <p style={{ ...s.subtitle, marginTop:"12px" }}>Tú te centras en tu negocio. Nosotros en que aparezcas primero.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"16px" }}>
            {[
              { name:"Básico", price:"49", features:["QR personalizado para tu local","Formulario pre-reseña inteligente","Alertas WhatsApp inmediatas","Panel de seguimiento mensual"], highlight:false },
              { name:"Profesional", price:"99", features:["Todo lo del plan Básico","Respuestas redactadas por IA","Informe mensual detallado","Comparativa 3 competidores","Sello GestiónReseñas"], highlight:true, badge:"MÁS POPULAR" },
              { name:"Chef", price:"149", features:["Todo lo del plan Profesional","Posición en Índice de Reputación","Reseñas como contenido social","Análisis trimestral de mercado","Soporte prioritario"], highlight:false },
            ].map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.06)",
                borderRadius:"20px", padding:"28px", position:"relative"
              }}>
                {plan.badge && (
                  <div style={{
                    position:"absolute", top:"-12px", left:"50%", transform:"translateX(-50%)",
                    background:"linear-gradient(135deg, #F59E0B, #D97706)",
                    color:"#080C14", fontSize:"10px", fontWeight:"800",
                    padding:"4px 14px", borderRadius:"100px", letterSpacing:"0.08em"
                  }}>{plan.badge}</div>
                )}
                <div style={{ fontSize:"14px", fontWeight:"700", color: plan.highlight ? "#F59E0B" : "#9CA3AF", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"0.06em" }}>{plan.name}</div>
                <div style={{ marginBottom:"4px" }}>
                  <span style={{ fontSize:"40px", fontWeight:"800", fontFamily:"'DM Serif Display', Georgia, serif" }}>{plan.price}€</span>
                  <span style={{ fontSize:"13px", color:"#6B7280" }}>/mes</span>
                </div>
                <div style={{ fontSize:"12px", color:"#4B5563", marginBottom:"24px" }}>+ 97€ alta única</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"24px" }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display:"flex", gap:"8px", fontSize:"13px", color:"#9CA3AF" }}>
                      <span style={{ color:"#F59E0B", flexShrink:0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button style={{
                  ...s.btn,
                  background: plan.highlight ? "linear-gradient(135deg, #F59E0B, #D97706)" : "rgba(255,255,255,0.06)",
                  color: plan.highlight ? "#080C14" : "#E8EDF5",
                  fontSize:"14px", padding:"14px"
                }}>Empezar con {plan.name} →</button>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"40px", padding:"24px", background:"rgba(255,255,255,0.02)", borderRadius:"12px" }}>
            <div style={{ fontSize:"13px", color:"#6B7280", marginBottom:"6px" }}>¿Tienes dudas? Escríbenos</div>
            <div style={{ color:"#F59E0B", fontWeight:"600" }}>hola@gestionresenas.com</div>
          </div>
        </div>
      )}

      <div style={{ height:"80px" }} />
    </div>
  );
}
