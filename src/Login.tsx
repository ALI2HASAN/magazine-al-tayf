import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const COLORS = {
  void: "#05060F",
  panel: "#0D0F1F",
  panelBorder: "rgba(255,255,255,0.08)",
  text: "#EAEBF5",
  textMuted: "#8A8FB0",
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.void, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.text, fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap');
        .display-font { font-family: 'Almarai', sans-serif; }
      `}</style>

      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.panelBorder}`, borderRadius: "16px", padding: "40px", maxWidth: "400px", width: "100%" }}>
        <h1 className="display-font" style={{ fontSize: "28px", fontWeight: "800", marginBottom: "30px", textAlign: "center" }}>الطيف</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "8px", color: COLORS.textMuted }}>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text, fontSize: "14px", fontFamily: "inherit" }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "8px", color: COLORS.textMuted }}>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", color: COLORS.text", fontSize: "14px", fontFamily: "inherit" }}
              required
            />
          </div>

          {error && <p style={{ color: "#FF6B6B", fontSize: "14px", marginBottom: "20px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#7FE7FF", color: "#000", fontWeight: "700", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", marginBottom: "20px" }}
          >
            {loading ? "جاري..." : (isRegister ? "إنشاء حساب" : "دخول")}
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ width: "100%", padding: "12px", background: "transparent", color: "#7FE7FF", border: `1px solid ${COLORS.panelBorder}`, borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}
          >
            {isRegister ? "لديّ حساب بالفعل" : "إنشاء حساب جديد"}
          </button>
        </form>
      </div>
    </div>
  );
}
