import { useState, useEffect } from "react";

const useInView = (threshold = 0.15) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);
  return [setRef, inView];
};

const Stat = ({ number, label, delay }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      textAlign: "center", padding: "32px 24px",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    }}>
      <div style={{
        fontSize: "clamp(40px, 6vw, 64px)", fontWeight: "800", lineHeight: "1",
        fontFamily: "'Fraunces', Georgia, serif", color: "#F5C842", marginBottom: "10px"
      }}>{number}</div>
      <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.5", maxWidth: "160px", margin: "0 auto" }}>{label}</div>
    </div>
  );
};

const FactRow = ({ icon, text, delay, inView }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: "16px", padding: "20px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)",
    transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
  }}>
    <div style={{
      width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
      background: "rgba(245,200,66,0.1)", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: "18px"
    }}>{icon}</div>
    <div style={{ fontSize: "15px", color: "#C9D0DC", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

export default function App() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [heroRef, heroIn] = useInView(0.1);
  const [statsRef, statsIn] = useInView(0.1);
  const [factsRef, factsIn] = useInView(0.1);
  const [formRef, formIn] = useInView(0.1);

const handleSubmit = async () => {
  if (!name || !business || !city || !email) return;
  setSending(true);
  try {
    await fetch("https://hook.eu1.make.com/brrpywh856dt36b3db6ikghf4z7d4cq1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: name, negocio: business, ciudad: city, email: email })
    });
  } catch (e) { console.error(e); }
  setSending(false);
  setSent(true);
};

  const facts = [
    { icon: "🤖", text: "<strong style='color:#F5C842'>ChatGPT, Gemini y Perplexity</strong> recomiendan negocios basándose en reseñas públicas de Google. Si no tienes suficientes reseñas recientes, simplemente no existes para la inteligencia artificial.", delay: 100 },
    { icon: "📈", text: "Google actualizó su algoritmo local en 2024: <strong style='color:#F5C842'>la frecuencia y recencia</strong> de las reseñas pesan más que nunca en el ranking. Un negocio con 10 reseñas al mes supera a uno con 500 antiguas.", delay: 200 },
    { icon: "🔍", text: "<strong style='color:#F5C842'>El 93% de los consumidores</strong> consulta reseñas online antes de elegir dónde ir. No es una tendencia — es el nuevo comportamiento por defecto de cualquier cliente.", delay: 300 },
    { icon: "💬", text: "Los negocios que responden al <strong style='color:#F5C842'>100% de sus reseñas</strong> tienen de media 0,3 puntos más de valoración. En un mercado donde la diferencia entre el 1º y el 5º es de 0,2 puntos, eso lo cambia todo.", delay: 400 },
    { icon: "⚠️", text: "<strong style='color:#F5C842'>1 reseña negativa sin respuesta</strong> hace que el 40% de los clientes potenciales descarte un negocio. Capturarla antes de que llegue a Google marca la diferencia.", delay: 500 },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#0A0D12", color:"#E8EDF5", fontFamily:"'Outfit', -apple-system, sans-serif", position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,800;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.12} 50%{opacity:0.22} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        input::placeholder { color:#4B5563; }
        input:focus { outline:none; border-color:rgba(245,200,66,0.5) !important; background:rgba(245,200,66,0.04) !important; }
        @media(max-width:640px) {
          .stats-grid { grid-template-columns:1fr 1fr !important; }
          .hero-title { font-size:clamp(32px,8vw,52px) !important; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"#F5C842", filter:"blur(120px)", opacity:0.07, top:-200, left:-200, animation:"pulse 5s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"#3B82F6", filter:"blur(120px)", opacity:0.06, bottom:-100, right:-100, animation:"pulse 7s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"#F5C842", filter:"blur(80px)", opacity:0.04, top:"50%", left:"60%", animation:"pulse 9s ease-in-out infinite" }} />
      </div>

      {/* NAV */}
      <nav style={{ position:"relative", zIndex:10, padding:"24px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:"18px", fontWeight:"800", letterSpacing:"-0.02em" }}>
          Gestiónde<span style={{ color:"#F5C842" }}>Reseñas</span>.com
        </div>
        <div style={{ fontSize:"12px", color:"#4B5563", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Reputación digital para negocios
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position:"relative", zIndex:10, maxWidth:"860px", margin:"0 auto", padding:"80px 24px 60px", textAlign:"center" }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.2)",
          borderRadius:"100px", padding:"6px 18px", marginBottom:"36px",
          opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(16px)",
          transition:"all 0.6s ease"
        }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#F5C842" }} />
          <span style={{ fontSize:"12px", color:"#F5C842", fontWeight:"600", letterSpacing:"0.1em", textTransform:"uppercase" }}>La reputación digital lo es todo</span>
        </div>

        <h1 className="hero-title" style={{
          fontFamily:"'Fraunces', Georgia, serif",
          fontSize:"clamp(40px, 6vw, 72px)", fontWeight:"900", lineHeight:"1.05",
          letterSpacing:"-0.03em", marginBottom:"28px",
          opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(24px)",
          transition:"all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s"
        }}>
          Internet ha cambiado.<br />
          <span style={{
            background:"linear-gradient(135deg, #F5C842 0%, #FBBF24 50%, #F5C842 100%)",
            backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 3s linear infinite"
          }}>¿Lo sabe tu negocio?</span>
        </h1>

        <p style={{
          fontSize:"18px", color:"#8B95A8", lineHeight:"1.7", maxWidth:"580px", margin:"0 auto 48px",
          opacity: heroIn ? 1 : 0, transform: heroIn ? "translateY(0)" : "translateY(24px)",
          transition:"all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s"
        }}>
          La forma en que los clientes eligen un negocio ha cambiado radicalmente.
          Las reseñas ya no son un extra — son el nuevo boca a boca,
          y la inteligencia artificial las usa para decidir a quién recomendar.
        </p>

        <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity: heroIn ? 0.4 : 0, transition:"all 0.7s ease 0.6s" }}>
          <span style={{ fontSize:"12px", color:"#4B5563", letterSpacing:"0.1em", textTransform:"uppercase" }}>Descubre por qué importa</span>
          <div style={{ fontSize:"20px", animation:"float 2s ease-in-out infinite" }}>↓</div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ position:"relative", zIndex:10, maxWidth:"900px", margin:"0 auto", padding:"0 24px 80px" }}>
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"24px", overflow:"hidden" }}>
          <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[
              { number:"93%", label:"de consumidores consulta reseñas antes de elegir dónde ir", delay:0 },
              { number:"3,4×", label:"más clientes obtienen los negocios con más reseñas recientes", delay:100 },
              { number:"0,3★", label:"más de valoración media tienen los que responden todas las reseñas", delay:200 },
              { number:"40%", label:"de clientes descarta un negocio con reseñas negativas sin responder", delay:300 },
            ].map((st, i) => (
              <div key={i} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <Stat {...st} />
              </div>
            ))}
          </div>
          <div style={{ padding:"16px 24px", display:"flex", alignItems:"center", gap:"8px", opacity: statsIn ? 1 : 0, transition:"all 0.6s ease 0.4s" }}>
            <span style={{ fontSize:"11px", color:"#4B5563" }}>Fuentes:</span>
            <span style={{ fontSize:"11px", color:"#4B5563" }}>BrightLocal Consumer Review Survey 2024 · Google Business Profile data · Harvard Business Review</span>
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section style={{ position:"relative", zIndex:10, maxWidth:"760px", margin:"0 auto", padding:"0 24px 80px" }}>
        <div ref={factsRef} style={{ opacity: factsIn ? 1 : 0, transform: factsIn ? "translateY(0)" : "translateY(32px)", transition:"all 0.6s ease" }}>
          <div style={{ marginBottom:"48px" }}>
            <div style={{ fontSize:"12px", color:"#F5C842", fontWeight:"600", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"12px" }}>Por qué ahora es el momento</div>
            <h2 style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:"clamp(28px, 4vw, 42px)", fontWeight:"800", lineHeight:"1.15", letterSpacing:"-0.02em" }}>
              5 razones por las que<br />las reseñas son urgentes
            </h2>
          </div>
          <div>
            {facts.map((f, i) => <FactRow key={i} {...f} inView={factsIn} />)}
          </div>
        </div>
      </section>

      {/* CALLOUT */}
      <div style={{ position:"relative", zIndex:10, maxWidth:"760px", margin:"0 auto 80px", padding:"0 24px" }}>
        <div style={{ background:"linear-gradient(135deg, rgba(245,200,66,0.08), rgba(245,200,66,0.02))", border:"1px solid rgba(245,200,66,0.15)", borderRadius:"20px", padding:"32px", display:"flex", alignItems:"center", gap:"20px" }}>
          <div style={{ fontSize:"36px", flexShrink:0 }}>💡</div>
          <div>
            <div style={{ fontWeight:"600", marginBottom:"6px", fontSize:"16px" }}>La buena noticia</div>
            <div style={{ fontSize:"14px", color:"#9CA3AF", lineHeight:"1.6" }}>
              Gestionar bien las reseñas no requiere horas de tu tiempo. Con el sistema adecuado
              puedes multiplicar tus reseñas, capturar la insatisfacción antes de que llegue a Google
              y responder en minutos — todo de forma automatizada.
            </div>
          </div>
        </div>
      </div>

      {/* LEAD FORM */}
      <section ref={formRef} style={{ position:"relative", zIndex:10, maxWidth:"600px", margin:"0 auto", padding:"0 24px 120px" }}>
        <div style={{ opacity: formIn ? 1 : 0, transform: formIn ? "translateY(0)" : "translateY(40px)", transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ textAlign:"center", marginBottom:"40px" }}>
            <div style={{ fontSize:"12px", color:"#F5C842", fontWeight:"600", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"12px" }}>Informe gratuito</div>
            <h2 style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:"clamp(28px, 4vw, 40px)", fontWeight:"800", lineHeight:"1.15", letterSpacing:"-0.02em", marginBottom:"16px" }}>
              Analizamos tu negocio<br /><span style={{ color:"#F5C842" }}>gratis y sin compromiso</span>
            </h2>
            <p style={{ fontSize:"15px", color:"#8B95A8", lineHeight:"1.6" }}>
              Introduce los datos de tu negocio y en menos de 24h recibirás un informe real
              con tu posición en Google, comparativa con tu competencia y un plan de acción personalizado.
            </p>
          </div>

          {!sent ? (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"24px", padding:"36px", backdropFilter:"blur(10px)" }}>
              {[
                { label:"Tu nombre", placeholder:"¿Cómo te llamamos?", value:name, set:setName, type:"text" },
                { label:"Nombre de tu negocio", placeholder:"Nombre exacto como aparece en Google", value:business, set:setBusiness, type:"text" },
                { label:"Ciudad", placeholder:"Madrid, Barcelona, Valencia...", value:city, set:setCity, type:"text" },
                { label:"Tu email", placeholder:"Para enviarte el informe", value:email, set:setEmail, type:"email" },
              ].map((field, i) => (
                <div key={i} style={{ marginBottom:"16px" }}>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:"#6B7280", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    style={{ width:"100%", padding:"14px 18px", borderRadius:"12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#E8EDF5", fontSize:"15px", transition:"all 0.2s" }}
                  />
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={!name || !business || !city || !email || sending}
                style={{
                  width:"100%", padding:"16px", borderRadius:"14px", border:"none",
                  background:(!name||!business||!city||!email) ? "rgba(245,200,66,0.3)" : "linear-gradient(135deg, #F5C842, #D97706)",
                  color:(!name||!business||!city||!email) ? "rgba(0,0,0,0.4)" : "#0A0D12",
                  fontSize:"16px", fontWeight:"700",
                  cursor:(!name||!business||!city||!email) ? "not-allowed" : "pointer",
                  transition:"all 0.2s", marginTop:"8px",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"10px"
                }}
              >
                {sending ? (
                  <>
                    <div style={{ width:18, height:18, border:"2px solid rgba(0,0,0,0.3)", borderTop:"2px solid #0A0D12", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    Enviando...
                  </>
                ) : "Quiero mi informe gratuito →"}
              </button>

              <p style={{ fontSize:"12px", color:"#374151", textAlign:"center", marginTop:"14px", lineHeight:"1.5" }}>
                Sin spam. Sin compromiso. Tu informe personalizado en menos de 24h.
              </p>
            </div>
          ) : (
            <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"24px", padding:"48px 36px", textAlign:"center" }}>
              <div style={{ fontSize:"48px", marginBottom:"20px" }}>✅</div>
              <h3 style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:"26px", fontWeight:"800", marginBottom:"12px" }}>
                ¡Perfecto, {name}!
              </h3>
              <p style={{ fontSize:"15px", color:"#9CA3AF", lineHeight:"1.6" }}>
                Hemos recibido tu solicitud para <strong style={{ color:"#E8EDF5" }}>{business}</strong>.
                En menos de 24 horas tendrás en tu email el informe completo de reputación
                con tu posición real en Google y las recomendaciones para mejorarla.
              </p>
              <div style={{ marginTop:"28px", fontSize:"13px", color:"#4B5563" }}>
                ¿Tienes dudas? Escríbenos a <span style={{ color:"#F5C842" }}>hola@gestionreseñas.com</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position:"relative", zIndex:10, borderTop:"1px solid rgba(255,255,255,0.04)", padding:"32px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
        <div style={{ fontFamily:"'Fraunces', Georgia, serif", fontSize:"15px", fontWeight:"800" }}>
          Gestiónde<span style={{ color:"#F5C842" }}>Reseñas</span>.com
        </div>
        <div style={{ fontSize:"12px", color:"#374151" }}>
          © 2026 · GestióndeReseñas.com · hola@gestiondereseñas.com
        </div>
      </footer>
    </div>
  );
}
