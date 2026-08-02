import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import Home from './Home';
import Article from './Article';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ background: '#05060F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>جاري التحميل...</div>;

  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية والمقالات متاحة للجميع فوراً بدون تسجيل دخول */}
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        
        {/* صفحة تسجيل الدخول الخاصة بكم */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* لوحة التحكم محمية ولا تدخلها إلا إذا كنت مسجلاً للدخول */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

### ما الذي سيتغير بهذا التعديل؟
1. **الزائر العادي:** عندما يدخل على رابط الموقع (`/`) ستفتح له الصفحة الرئيسية ومجلة "الطيف" وتصفح المقالات فوراً ودون أن يطلب منه الموقع أي تسجيل دخول.
2. **أنتم (الإدارة):** لوحة التحكم (`/dashboard`) ستظل محمية، ولن يتمكن أحد من الوصول إليها لإضافة أو تعديل المقالات إلا بعد تسجيل الدخول بحساب Firebase الخاص بك أو بصديقتك.

قم باستبدال الكود في ملف **`App.tsx`** بهذا الكود واحفظه، وسيصبح الموقع جاهزاً بالشكل المطلوب تماماً!
