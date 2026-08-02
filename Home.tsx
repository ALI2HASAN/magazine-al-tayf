import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Almarai:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const COLORS = {
  void: "#05060F",
  panel: "#0D0F1F",
  panelBorder: "rgba(255,255,255,0.08)",
  text: "#EAEBF5",
  textMuted: "#8A8FB0",
};

const CATEGORIES = [
  { id: "science", name: "العلوم", color: "#7FE7FF", x: 60, y: 85, r: 7 },
  { id: "literature", name: "الأدب", color: "#FFC773", x: 155, y: 40, r: 5 },
  { id: "philosophy", name: "الفلسفة", color: "#B9A9FF", x: 250, y: 105, r: 5 },
  { id: "cinema", name: "السينما", color: "#E36BFF", x: 340, y: 50, r: 5 },
];

const LINKS = [["science", "literature"], ["literature", "philosophy"], ["philosophy", "cinema"]];
const STARS = Array.from({ length: 50 }).map((_, i) => ({
  id: i, top: Math.random() * 100, left: Math.random() * 100, size: Math.random() < 0.15 ? 2 : 1, delay: Math.random() * 6,
}));

function getCat(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  function handleMouseMove(e: any) {
    const { innerWidth, innerHeight } = window;
    setMouse({ x: (e.clientX / innerWidth - 0.5) * 2, y: (e.clientY / innerHeight - 0.5) * 2 });
  }

  const featured = articles[0];
  const rest = articles.slice(1);
  const visible = active ? rest.filter((a) => a.category === active) : rest;

  return (
    <div onMouseMove={handleMouseMove} style={{ background: COLORS.void, minHeight: "100vh", color: COLORS.text, position: "relative", overflow: "hidden", fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <style>{FONTS}</style>
      <style>{`
        .display-font { font-family: 'Almarai', sans-serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }
        .star { position: absolute; border-radius: 50%; background: #fff; animation: twinkle 5s ease-in-out infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .reveal-load { opacity: 0; }
        .reveal-load.on { animation: fadeUp 0.7s ease forwards; }
        .card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .card:hover { transform: translateY(-5px); border-color: var(--glow) !important; box-shadow: 0 8px 30px -10px var(--glow); }
      `}</style>

      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {STARS.map((s) => (
          <span key={s.id} className="star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
        ))}
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 380, height: 380, borderRadius: "50%", filter: "blur(70px)", background: "#7C3AED", opacity: 0.16, transform: `translate(${mouse.x * -12}px, ${mouse.y * -12}px)`, transition: "transform 0.4s ease-out" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <header className={`reveal-load ${loaded ? "on" : ""}`} style={{ padding: "24px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.panelBorder}` }}>
          <h1 className="display-font" style={{ fontSize: "28px", fontWeight: "800" }}>الطيف</h1>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: COLORS.textMuted }}>
            <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>تسجيل دخول</Link>
          </div>
        </header>

        {featured && (
          <section style={{ padding: "56px 56px 32px" }}>
            <p className={`mono-font reveal-load ${loaded ? "on" : ""}`} style={{ fontSize: "12px", marginBottom: "12px", color: getCat(featured.category)?.color || "#7FE7FF", animationDelay: "0.1s" }}>
              {getCat(featured.category)?.name} · مقال العدد
            </p>
            <h2 className={`display-font reveal-load ${loaded ? "on" : ""}`} style={{ fontSize: "32px", fontWeight: "800", lineHeight: "1.2", marginBottom: "20px", animationDelay: "0.2s" }}>
              {featured.title}
            </h2>
            <p className={`reveal-load ${loaded ? "on" : ""}`} style={{ fontSize: "18px", lineHeight: "1.6", marginBottom: "20px", color: COLORS.textMuted, maxWidth: "600px", animationDelay: "0.3s" }}>
              {featured.excerpt}
            </p>
            <Link to={`/article/${featured.id}`} style={{ fontSize: "12px", color: COLORS.textMuted, textDecoration: "none", cursor: "pointer" }}>
              اقرأ المزيد →
            </Link>
          </section>
        )}

        <section style={{ padding: "48px 56px" }}>
          <svg viewBox="0 0 400 160" style={{ maxWidth: 480, width: "100%", height: "auto" }}>
            {LINKS.map(([a, b], i) => {
              const ca = getCat(a);
              const cb = getCat(b);
              const dimmed = active && active !== a && active !== b;
              return ca && cb ? (
                <line key={i} x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y} stroke="#5A5F80" strokeWidth="1" opacity={dimmed ? 0.15 : 0.5} />
              ) : null;
            })}
            {CATEGORIES.map((cat) => {
              const isActive = active === cat.id;
              const dimmed = active && !isActive;
              return (
                <g key={cat.id} onClick={() => setActive(isActive ? null : cat.id)} style={{ cursor: "pointer" }}>
                  <circle cx={cat.x} cy={cat.y} r={isActive ? cat.r + 4 : cat.r} fill={cat.color} opacity={dimmed ? 0.3 : 1} />
                  <text x={cat.x} y={cat.y - 14} textAnchor="middle" fontSize="10" fill={dimmed ? "#5A5F80" : "#EAEBF5"} fontFamily="Tajawal">
                    {cat.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mono-font" style={{ fontSize: "11px", marginTop: "12px", color: COLORS.textMuted }}>
            {active ? `يعرض: ${getCat(active)?.name}` : "اضغط على نجمة لتصفح قسمها"}
          </p>
        </section>

        <section style={{ padding: "0 56px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", maxWidth: "1000px" }}>
            {visible.map((a, i) => {
              const [ref, inView] = useInView();
              const cat = getCat(a.category);
              return (
                <Link key={a.id} to={`/article/${a.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div ref={ref} className="card" style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: "12px", padding: "24px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`, "--glow": cat?.color } as any}>
                    <p className="mono-font" style={{ fontSize: "11px", marginBottom: "12px", color: cat?.color || "#7FE7FF" }}>{cat?.name}</p>
                    <h3 className="display-font" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", lineHeight: "1.3" }}>{a.title}</h3>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px", color: COLORS.textMuted }}>{a.excerpt}</p>
                    <p className="mono-font" style={{ fontSize: "11px", color: COLORS.textMuted }}>{a.author} · {a.readTime}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer style={{ padding: "24px 56px", textAlign: "center", borderTop: `1px solid ${COLORS.panelBorder}`, color: COLORS.textMuted }}>
          <p className="mono-font" style={{ fontSize: "12px" }}>الطيف — مجلة مستقلة</p>
        </footer>
      </div>
    </div>
  );
}
