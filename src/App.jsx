import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  { id: 1, tag: "ML · Healthcare", color: "#7C3AED", title: "AI Pain Detection Platform", desc: "AI-powered remote patient monitoring platform enabling healthcare professionals to detect and assess pain levels without in-person visits.", tech: ["Python", "Flask", "CV"], href: "https://github.com/missingpizaslice/FYPJ", icon: "🧠" },
  { id: 2, tag: "Analysis · PowerBI", color: "#059669", title: "AWC Data Journalism Dashboard", desc: "KPI dashboards with slicers, filters, and drill-down features turning AWC's raw operational data into actionable business intelligence.", tech: ["PowerBI", "SQL", "DAX"], href: "https://github.com/PkJoshi23/AWC_Data_Journalism_Project", icon: "📊" },
  { id: 3, tag: "ML · NLP", color: "#7C3AED", title: "Genre Classification via Reviews", desc: "NLP models that classify media genres from user-written reviews, powering a recommendation engine for a streaming platform.", tech: ["Python", "NLTK", "sklearn"], href: "https://github.com/PkJoshi23/Text_and_Social_Analytics", icon: "🔤" },
  { id: 4, tag: "ML · Big Data", color: "#2563EB", title: "American Airlines Revenue Analysis", desc: "Applied ML techniques to airline revenue decline data, uncovering strategies and recovery levers through predictive modelling.", tech: ["Python", "Pandas", "Spark"], href: "https://github.com/PkJoshi23/Big_Data_Management_Project", icon: "✈️" },
  { id: 5, tag: "Analysis · PowerBI", color: "#059669", title: "Singapore Livability Insights", desc: "PowerBI dashboard evaluating Singapore's livability and workability across 5 key dimensions for data-driven urban policy decisions.", tech: ["PowerBI", "Tableau", "Python"], href: "https://github.com/PkJoshi23/Visual_Analytics_Project", icon: "🏙️" },
  { id: 6, tag: "ML · Predictive", color: "#7C3AED", title: "Startup Success Predictor", desc: "ML classification models predicting startup success or failure, helping venture capitalists make smarter early-stage investment decisions.", tech: ["Python", "XGBoost", "Pandas"], href: "https://github.com/PkJoshi23/Predictive_Analytics_Project", icon: "🚀" },
];

const SKILLS = [
  { cat: "Web Dev", items: ["React JS", "HTML / CSS", "JavaScript", "Flask"] },
  { cat: "Analysis", items: ["PowerBI", "Tableau", "RapidMiner", "KNIME"] },
  { cat: "Programming", items: ["Python", "Pandas", "SQL", "Java"] },
  { cat: "Platform", items: ["Power Apps", "Power Automate", "Git / GitHub"] },
];

// ── Hooks ─────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mob;
}

// ── Animated number ───────────────────────────────────
function AnimNum({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 40);
        if (start >= target) { setVal(target); return; }
        setVal(start);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Fade-in on scroll ─────────────────────────────────
function FadeIn({ children, delay = 0 }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Cursor blob (desktop only) ────────────────────────
function CursorBlob() {
  const ref = useRef();
  const mob = useIsMobile();
  useEffect(() => {
    if (mob) return;
    const fn = (e) => {
      if (!ref.current) return;
      ref.current.style.left = e.clientX + "px";
      ref.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [mob]);
  if (mob) return null;
  return (
    <div ref={ref} style={{
      position: "fixed", pointerEvents: "none", zIndex: 0,
      width: 420, height: 420, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
      transform: "translate(-50%,-50%)",
      transition: "left 0.18s ease, top 0.18s ease",
    }} />
  );
}

const NoiseOverlay = () => (
  <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.025, pointerEvents: "none", zIndex: 1 }}>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>
);

// ── Nav ───────────────────────────────────────────────
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mob = useIsMobile();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  // close menu on resize to desktop
  useEffect(() => { if (!mob) setMenuOpen(false); }, [mob]);

  const links = ["about", "skills", "projects", "contact"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5vw", height: 60,
        background: scrolled || menuOpen ? "rgba(5,5,10,0.95)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: 13, color: "#a78bfa", letterSpacing: "0.1em" }}>
          PJ.dev
        </span>

        {/* Desktop links */}
        {!mob && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {links.map(l => (
              <a key={l} href={`#${l}`} style={{
                fontSize: 13, fontWeight: 500,
                color: active === l ? "#fff" : "rgba(255,255,255,0.45)",
                textDecoration: "none", letterSpacing: "0.03em", textTransform: "capitalize",
                transition: "color 0.2s",
              }}>{l}</a>
            ))}
            <a href="https://pkjoshi23.github.io/portfolio/Resume.pdf" target="_blank" style={{
              fontSize: 12, fontWeight: 600, padding: "7px 16px",
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
              borderRadius: 6, color: "#c4b5fd", textDecoration: "none",
            }}>Resume ↗</a>
          </div>
        )}

        {/* Hamburger */}
        {mob && (
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 8,
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
                transition: "all 0.25s",
                transform: menuOpen
                  ? i === 0 ? "translateY(7px) rotate(45deg)"
                  : i === 2 ? "translateY(-7px) rotate(-45deg)"
                  : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}/>
            ))}
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      {mob && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, zIndex: 199,
          background: "rgba(5,5,10,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: menuOpen ? "24px 5vw 32px" : "0 5vw",
          maxHeight: menuOpen ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, padding 0.35s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(l => (
              <a key={l} href={`#${l}`} onClick={() => setMenuOpen(false)} style={{
                fontSize: 20, fontWeight: 600, color: active === l ? "#a78bfa" : "rgba(255,255,255,0.7)",
                textDecoration: "none", textTransform: "capitalize", padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "color 0.2s",
              }}>{l}</a>
            ))}
            <a href="https://pkjoshi23.github.io/portfolio/Resume.pdf" target="_blank"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 16, fontSize: 14, fontWeight: 600, padding: "12px 20px",
                background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)",
                borderRadius: 8, color: "#c4b5fd", textDecoration: "none", textAlign: "center",
              }}>
              ↓ Download Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────
function Hero() {
  const mob = useIsMobile();
  const [typed, setTyped] = useState("");
  const titles = ["Data Analyst", "ML Engineer", "Dashboard Designer", "Python Developer"];
  const [ti, setTi] = useState(0);

  useEffect(() => {
    let i = 0, current = titles[ti], adding = true;
    const iv = setInterval(() => {
      if (adding) {
        setTyped(current.slice(0, i + 1)); i++;
        if (i >= current.length) adding = false;
      } else {
        setTyped(current.slice(0, i - 1)); i--;
        if (i <= 0) { adding = true; setTi(t => (t + 1) % titles.length); clearInterval(iv); }
      }
    }, 80);
    return () => clearInterval(iv);
  }, [ti]);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: mob ? "100px 6vw 60px" : "120px 5vw 80px",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-40px) scale(1.05)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(30px) scale(0.95)} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        * { box-sizing: border-box; }
      `}</style>

      {/* bg blobs */}
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width: mob?350:700, height: mob?350:700, background:"radial-gradient(circle,rgba(124,58,237,0.22) 0%,transparent 60%)", borderRadius:"50%", pointerEvents:"none", animation:"float1 8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"-10%", left: mob?"10%":"30%", width: mob?280:500, height: mob?280:500, background:"radial-gradient(circle,rgba(37,99,235,0.16) 0%,transparent 60%)", borderRadius:"50%", pointerEvents:"none", animation:"float2 10s ease-in-out infinite" }}/>

      <div style={{ maxWidth: 900, position: "relative", zIndex: 2, width: "100%" }}>
        <FadeIn delay={0}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: mob ? 20 : 28,
            padding: "6px 14px", borderRadius: 100,
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#a78bfa", display:"inline-block", boxShadow:"0 0 8px #a78bfa", animation:"blink 2s infinite" }}/>
            <span style={{ fontSize: mob?11:12, color:"#c4b5fd", fontFamily:"monospace", letterSpacing:"0.08em" }}>
              Available for opportunities · Singapore
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <h1 style={{
            fontSize: mob ? "clamp(3rem,15vw,4.5rem)" : "clamp(3.5rem,9vw,7.5rem)",
            fontWeight: 900, lineHeight: 0.92,
            letterSpacing: "-0.04em", marginBottom: mob ? 16 : 24,
          }}>
            <span style={{ display:"block", color:"#fff" }}>Parikshit</span>
            <span style={{
              display:"block",
              background:"linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)",
              backgroundSize:"200% 200%",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"gradShift 4s ease infinite",
            }}>Joshi</span>
          </h1>
        </FadeIn>

        <FadeIn delay={200}>
          <div style={{ fontSize: mob?"1rem":"clamp(1.1rem,2.5vw,1.5rem)", color:"rgba(255,255,255,0.5)", marginBottom: mob?32:48, fontWeight:300 }}>
            <span style={{ color:"rgba(255,255,255,0.85)", fontWeight:500 }}>{typed}</span>
            <span style={{ animation:"blink 1s infinite", color:"#a78bfa" }}>|</span>
            {!mob && <span style={{ marginLeft:8 }}>— turning raw data into real decisions</span>}
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom: mob?48:80 }}>
            <a href="#projects" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding: mob?"12px 22px":"13px 28px", borderRadius:8, fontWeight:600, fontSize: mob?13:14,
              background:"linear-gradient(135deg,#7c3aed,#4f46e5)", color:"#fff", textDecoration:"none",
              boxShadow:"0 0 32px rgba(124,58,237,0.4)",
            }}>View Projects</a>
            <a href="#contact" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding: mob?"12px 22px":"13px 28px", borderRadius:8, fontWeight:500, fontSize: mob?13:14,
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
              color:"rgba(255,255,255,0.8)", textDecoration:"none",
            }}>Get in touch</a>
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div style={{ display:"flex", gap:0, flexWrap:"wrap" }}>
            {[
              { n:6, suf:"+", label:"Projects shipped" },
              { n:3, suf:" mo", label:"EY internship" },
              { n:5, suf:"+", label:"Tech stacks" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: mob?"16px 24px":"20px 36px",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <div style={{ fontSize: mob?"1.6rem":"clamp(1.8rem,3vw,2.4rem)", fontWeight:800, color:"#fff", letterSpacing:"-0.03em", lineHeight:1 }}>
                  <AnimNum target={s.n} suffix={s.suf}/>
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:4, fontFamily:"monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:0.35, animation:"float2 2s ease-in-out infinite" }}>
        <div style={{ width:1, height:48, background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.6))" }}/>
        <span style={{ fontSize:10, fontFamily:"monospace", color:"#fff", letterSpacing:"0.12em" }}>SCROLL</span>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────
function About() {
  const mob = useIsMobile();
  return (
    <section id="about" style={{ padding: mob?"80px 6vw":"120px 5vw", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"linear-gradient(180deg,transparent 0%,rgba(124,58,237,0.04) 50%,transparent 100%)" }}/>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns: mob?"1fr":"1fr 1fr", gap: mob?48:80, alignItems:"start" }}>
        <FadeIn>
          <p style={{ fontSize:11, fontFamily:"monospace", color:"#a78bfa", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>About</p>
          <h2 style={{ fontSize: mob?"clamp(1.8rem,8vw,2.4rem)":"clamp(2rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.05, color:"#fff", marginBottom:28 }}>
            Building things that<br/>
            <span style={{ color:"#a78bfa" }}>make data useful</span>
          </h2>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:16, fontWeight:300 }}>
            I'm a Diploma graduate in AI & Data Analysis from Nanyang Polytechnic, with hands-on experience in machine learning, business intelligence, and full-stack web development.
          </p>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,0.55)", lineHeight:1.8, fontWeight:300 }}>
            At Ernst & Young, I built PowerBI dashboards that translated business requirements into insights executives could act on. I care about the last mile — not just running the model, but making the output legible to the people who need it.
          </p>
        </FadeIn>

        <FadeIn delay={mob?0:150}>
          <p style={{ fontSize:11, fontFamily:"monospace", color:"rgba(255,255,255,0.3)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16 }}>Timeline</p>
          <div>
            {[
              { year:"2024", role:"Data Analyst Intern", org:"Ernst & Young", dot:"#a78bfa" },
              { year:"2024", role:"Diploma in AI & Analytics", org:"Nanyang Polytechnic", dot:"#60a5fa" },
              { year:"2020", role:"O Level", org:"Canberra Secondary School", dot:"rgba(255,255,255,0.2)" },
              { year:"2016", role:"PSLE", org:"Endeavour Primary School", dot:"rgba(255,255,255,0.2)" },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:16, padding:"18px 0", borderBottom: i<3?"1px solid rgba(255,255,255,0.06)":"none", alignItems:"flex-start" }}>
                <span style={{ fontFamily:"monospace", fontSize:12, color:"rgba(255,255,255,0.25)", minWidth:36, paddingTop:3 }}>{item.year}</span>
                <div style={{ width:8, height:8, borderRadius:"50%", background:item.dot, marginTop:6, flexShrink:0, boxShadow: i<2?`0 0 10px ${item.dot}`:"none" }}/>
                <div>
                  <div style={{ fontSize:"0.9rem", fontWeight:600, color:"#fff", marginBottom:2 }}>{item.role}</div>
                  <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.35)" }}>{item.org}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────
function Skills() {
  const mob = useIsMobile();
  return (
    <section id="skills" style={{ padding: mob?"80px 6vw":"120px 5vw" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <FadeIn>
          <p style={{ fontSize:11, fontFamily:"monospace", color:"#a78bfa", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>Skills</p>
          <h2 style={{ fontSize: mob?"clamp(1.8rem,8vw,2.4rem)":"clamp(2rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.03em", color:"#fff", marginBottom:40 }}>
            What I work with
          </h2>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns: mob?"repeat(2,1fr)":"repeat(4,1fr)", gap:14 }}>
          {SKILLS.map((grp, gi) => (
            <FadeIn key={gi} delay={gi*70}>
              <div style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:14, padding: mob?"20px 18px":"28px 24px",
                backdropFilter:"blur(10px)", transition:"border-color 0.2s, background 0.2s",
                height:"100%",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(167,139,250,0.3)"; e.currentTarget.style.background="rgba(124,58,237,0.06)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}>
                <div style={{ fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>{grp.cat}</div>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                  {grp.items.map((item,ii) => (
                    <li key={ii} style={{ fontSize:"0.875rem", color:"rgba(255,255,255,0.7)", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ width:4, height:4, borderRadius:"50%", background:"#a78bfa", flexShrink:0, boxShadow:"0 0 6px #a78bfa" }}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Project Card ──────────────────────────────────────
function ProjectCard({ p, i }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={i * 60}>
      <a href={p.href} target="_blank" style={{ textDecoration:"none", display:"block", height:"100%" }}
        onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <div style={{
          background: hov?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.025)",
          border:`1px solid ${hov?"rgba(167,139,250,0.25)":"rgba(255,255,255,0.07)"}`,
          borderRadius:16, padding:"24px", height:"100%",
          display:"flex", flexDirection:"column",
          transition:"all 0.25s ease",
          transform: hov?"translateY(-4px)":"none",
          boxShadow: hov?"0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)":"none",
          position:"relative", overflow:"hidden",
        }}>
          {hov && <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, background:`radial-gradient(circle,${p.color}22 0%,transparent 70%)`, borderRadius:"50%", pointerEvents:"none" }}/>}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <span style={{ fontSize:10, fontFamily:"monospace", letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 12px", borderRadius:100, background:`${p.color}18`, border:`1px solid ${p.color}44`, color:p.color }}>{p.tag}</span>
            <span style={{ fontSize:22 }}>{p.icon}</span>
          </div>
          <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#fff", letterSpacing:"-0.01em", marginBottom:10, lineHeight:1.3 }}>{p.title}</h3>
          <p style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.45)", lineHeight:1.7, flex:1, marginBottom:20 }}>{p.desc}</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {p.tech.map(t=>(
                <span key={t} style={{ fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", padding:"3px 8px", borderRadius:100 }}>{t}</span>
              ))}
            </div>
            <span style={{ fontSize:11, fontFamily:"monospace", color: hov?"#a78bfa":"rgba(255,255,255,0.25)", transition:"color 0.2s", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>GitHub →</span>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

// ── Projects ──────────────────────────────────────────
function Projects() {
  const mob = useIsMobile();
  return (
    <section id="projects" style={{ padding: mob?"80px 6vw":"120px 5vw", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"linear-gradient(180deg,transparent 0%,rgba(37,99,235,0.04) 50%,transparent 100%)" }}/>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <FadeIn>
          <p style={{ fontSize:11, fontFamily:"monospace", color:"#a78bfa", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>Projects</p>
          <h2 style={{ fontSize: mob?"clamp(1.8rem,8vw,2.4rem)":"clamp(2rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.03em", color:"#fff", marginBottom:40 }}>Selected work</h2>
        </FadeIn>
        <div style={{ display:"grid", gridTemplateColumns: mob?"1fr":"repeat(3,1fr)", gap:14 }}>
          {PROJECTS.map((p,i) => <ProjectCard key={p.id} p={p} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────
function Contact() {
  const mob = useIsMobile();
  const links = [
    { label:"Email", val:"pkjoshichandra@gmail.com", href:"mailto:pkjoshichandra@gmail.com", icon:"✉️" },
    { label:"GitHub", val:"PkJoshi23", href:"https://github.com/PkJoshi23", icon:"🐙" },
    { label:"LinkedIn", val:"parikshit-joshi", href:"https://www.linkedin.com/in/parikshit-joshi-41402a277/", icon:"💼" },
  ];
  return (
    <section id="contact" style={{ padding: mob?"80px 6vw 60px":"120px 5vw 80px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <FadeIn>
          <p style={{ fontSize:11, fontFamily:"monospace", color:"#a78bfa", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16 }}>Contact</p>
          <h2 style={{ fontSize: mob?"clamp(1.8rem,8vw,2.4rem)":"clamp(2rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.03em", color:"#fff", marginBottom:16, lineHeight:1.05 }}>
            Let's work<br/><span style={{ color:"#a78bfa" }}>together</span>
          </h2>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,0.45)", lineHeight:1.75, marginBottom:40, fontWeight:300 }}>
            Open to full-time data analyst roles, internships, and interesting project collaborations. Drop me a message.
          </p>
        </FadeIn>
        <FadeIn delay={100}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
            {links.map((l,i) => (
              <a key={i} href={l.href} target="_blank" style={{ textDecoration:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:16, padding: mob?"14px 18px":"18px 22px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, transition:"all 0.2s", cursor:"pointer" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="rgba(124,58,237,0.08)"; e.currentTarget.style.borderColor="rgba(167,139,250,0.25)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; }}>
                  <span style={{ fontSize:20 }}>{l.icon}</span>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{l.label}</div>
                    <div style={{ fontSize: mob?"0.8rem":"0.9rem", color:"rgba(255,255,255,0.7)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.val}</div>
                  </div>
                  <span style={{ color:"rgba(255,255,255,0.2)", fontSize:14, flexShrink:0 }}>→</span>
                </div>
              </a>
            ))}
          </div>
          <a href="https://pkjoshi23.github.io/portfolio/Resume.pdf" target="_blank" style={{
            display:"inline-flex", alignItems:"center", gap:10,
            padding: mob?"12px 22px":"14px 28px",
            background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
            borderRadius:10, color:"#fff", fontWeight:600, fontSize: mob?13:14,
            textDecoration:"none", boxShadow:"0 0 40px rgba(124,58,237,0.35)",
          }}>↓ Download Resume</a>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────
function Footer() {
  const mob = useIsMobile();
  return (
    <footer style={{
      borderTop:"1px solid rgba(255,255,255,0.06)", padding:"24px 6vw",
      display:"flex", justifyContent:"space-between", alignItems:"center",
      flexWrap:"wrap", gap:8,
    }}>
      <span style={{ fontFamily:"monospace", fontSize:12, color:"rgba(255,255,255,0.2)" }}>© 2024 Parikshit Joshi</span>
      <span style={{ fontFamily:"monospace", fontSize:12, color:"#a78bfa" }}>Data Analyst · Singapore</span>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  useEffect(() => {
    const sections = ["hero","about","skills","projects","contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.35 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background:"#050508", minHeight:"100vh", fontFamily:"'Inter','Helvetica Neue',system-ui,sans-serif", overflowX:"hidden", position:"relative" }}>
      <CursorBlob/>
      <NoiseOverlay/>
      <Nav active={activeSection}/>
      <Hero/>
      <About/>
      <Skills/>
      <Projects/>
      <Contact/>
      <Footer/>
    </div>
  );
}
