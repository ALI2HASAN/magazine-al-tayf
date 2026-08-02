import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLORS = {
  void: "#05060F",
  panel: "#0D0F1F",
  panelBorder: "rgba(255,255,255,0.08)",
  text: "#EAEBF5",
  textMuted: "#8A8FB0",
};

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "articles", id));
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div style={{ background: COLORS.void, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.text }}>جاري التحميل...</div>;

  if (!article) return <div style={{ background: COLORS.void, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.text }}>المقالة غير موجودة</div>;

  return (
    <div style={{ background: COLORS.void, minHeight: "100vh", color: COLORS.text, fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .display-font { font-family: 'Almarai', sans-serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <header style={{ padding: "24px 56px", borderBottom: `1px solid ${COLORS.panelBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ color: COLORS.text, textDecoration: "none", fontSize: "14px" }}>← العودة</Link>
        <h1 className="display-font" style={{ fontSize: "24px", fontWeight: "800" }}>الطيف</h1>
        <div></div>
      </header>

      <article style={{ maxWidth: "800px", margin: "60px auto", padding: "0 24px" }}>
        <p className="mono-font" style={{ fontSize: "11px", color: "#7FE7FF", marginBottom: "12px" }}>{article.category?.toUpperCase()}</p>
        <h1 className="display-font" style={{ fontSize: "36px", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2" }}>{article.title}</h1>
        <p style={{ fontSize: "14px", color: COLORS.textMuted, marginBottom: "32px" }}>{article.author} · {article.readTime}</p>
        <div style={{ height: "2px", width: "60px", background: "#7FE7FF", marginBottom: "32px" }}></div>
        <div style={{ fontSize: "18px", lineHeight: "1.8", color: COLORS.text, whiteSpace: "pre-wrap" }}>
          {article.content}
        </div>
      </article>
    </div>
  );
}
