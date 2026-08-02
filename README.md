# الطيف — مجلة مستقلة

مجلة إلكترونية متنوعة بطابع فضائي خرافي، مكتوبة بـ React + TypeScript + Firebase.

## الميزات

- 🌌 واجهة فضائية بأنيميشنات سلسة
- 📝 لوحة تحكم كاملة لإدارة المقالات
- 🔐 مصادقة آمنة عبر Firebase
- 📱 متجاوب بكامل الأجهزة
- 🌍 نشر على GitHub Pages

## البدء السريع

### 1. النسخ والإعدادات
```bash
git clone https://github.com/ALI2HASAN/magazine-al-tayf.git
cd magazine-al-tayf
npm install
```

### 2. التشغيل المحلي
```bash
npm run dev
```
الموقع سيكون متاحاً على `http://localhost:5173`

### 3. البناء والنشر
```bash
npm run build
```

## التسجيل والمقالات

1. اذهب إلى `/login`
2. أنشئ حساباً جديداً أو سجل دخول
3. اذهب إلى `/dashboard` لكتابة وإدارة مقالاتك

## البنية

```
src/
├── lib/firebase.ts       # إعدادات Firebase
├── pages/
│   ├── Home.tsx         # الصفحة الرئيسية
│   ├── Article.tsx      # صفحة المقالة
│   ├── Dashboard.tsx    # لوحة التحكم
│   └── Login.tsx        # صفحة تسجيل الدخول
├── App.tsx              # المكون الرئيسي
└── main.tsx             # نقطة الدخول
```

## الترخيص

MIT
