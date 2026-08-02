import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';

const COLORS = {
  void: "#05060F",
  panel: "#0D0F1F",
  panelBorder: "rgba(255,255,255,0.08)",
  text: "#EAEBF5",
  textMuted: "#8A8FB0",
};

const CATEGORIES = [
  { id: "science", name: "العلوم" },
  { id: "literature", name: "الأدب" },
  { id: "philosophy", name: "الفلسفة" },
  { id: "cinema", name: "السينما" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: 'science', readTime: '5' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, "articles"), where("authorId", "==", auth.currentUser.uid));
        const snapshot = await getDocs(q);
        setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const data = { ...formData, author: auth.currentUser.email, authorId: auth.currentUser.uid, createdAt: new Date() };
      if (editing) {
        await updateDoc(doc(db, "articles", editing.id), data);
        setArticles(articles.map(a => a.id === editing.id ? { id: editing.id, ...data } : a));
      } else {
        const docRef = await addDoc(collection(db, "articles"), data);
        setArticles([...articles, { id: docRef.id, ...data }]);
      }
      setIsNew(false);
      setEditing(null);
      setFormData({ title: '', excerpt: '', content: '', category: 'science', readTime: '5' });
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المقالة؟")) {
      try {
        await deleteDoc(doc(db, "articles", id));
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={{ background: COLORS.void, minHeight: "100vh", color: COLORS.text, fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');
        .display-font { font-family: 'Almarai', sans-serif; }
      `}</style>

      <header style={{ padding: "24px 56px", borderBottom: `1px solid ${COLORS.panelBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="display-font" style={{ fontSize: "24px", fontWeight: "800" }}>لوحة التحكم</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#FF6B6B", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>تسجيل خروج</button>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        {!isNew && !editing && (
          <button onClick={() => setIsNew(true)} style={{ marginBottom: "30px", padding: "12px 24px", background: "#7FE7FF", color: "#000", fontWeight: "700", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            + مقالة جديدة
          </button>
        )}

        {(isNew || editing) && (
          <form onSubmit={handleSave} style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: "12px", padding: "30px", marginBottom: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: COLORS.textMuted }}>العنوان</label>
              <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontFamily: "inherit" }} required />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: COLORS.textMuted }}>الملخص</label>
              <input value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontFamily: "inherit" }} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: COLORS.textMuted }}>التصنيف</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontFamily: "inherit" }}>
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: COLORS.textMuted }}>وقت القراءة</label>
                <input type="text" value={formData.readTime} onChange={(e) => setFormData({...formData, readTime: e.target.value})} placeholder="مثل: 5 دقائق" style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontFamily: "inherit" }} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: COLORS.textMuted }}>المحتوى</label>
              <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} style={{ width: "100%", padding: "12px", minHeight: "300px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontFamily: "inherit", resize: "vertical" }} required />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={{ flex: 1, padding: "12px", background: "#7FE7FF", color: "#000", fontWeight: "700", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                {editing ? "تحديث" : "نشر"}
              </button>
              <button type="button" onClick={() => { setIsNew(false); setEditing(null); }} style={{ flex: 1, padding: "12px", background: "transparent", color: "#7FE7FF", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", cursor: "pointer" }}>
                إلغاء
              </button>
            </div>
          </form>
        )}

        <div>
          <h2 className="display-font" style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>مقالاتي ({articles.length})</h2>
          {articles.map(article => (
            <div key={article.id} style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: "12px", padding: "20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{article.title}</h3>
                <p style={{ fontSize: "14px", color: COLORS.textMuted }}>{article.category} · {article.readTime}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditing(article); setIsNew(false); setFormData({ title: article.title, excerpt: article.excerpt, content: article.content, category: article.category, readTime: article.readTime }); }} style={{ padding: "8px 16px", background: "#7FE7FF", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                  تعديل
                </button>
                <button onClick={() => handleDelete(article.id)} style={{ padding: "8px 16px", background: "#FF6B6B", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
