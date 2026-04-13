# 🛍️ Agyaal Store | أجيال ستور

> متجر إلكتروني لبيع ملابس الأطفال — مشروع تخرج نظم المعلومات الإدارية 2024/2025

---

## 📋 نظرة عامة

**أجيال ستور** منصة تجارة إلكترونية متكاملة لبيع ملابس الأطفال، مبنية باستخدام Next.js 14 في الواجهة الأمامية و Node.js + Express في الواجهة الخلفية مع قاعدة بيانات MongoDB.

---

## 🏗️ هيكل المشروع

```
agyaal-store/
├── agyaal-frontend/     # Next.js 14 App
└── agyaal-backend/      # Node.js + Express API
```

---

## ⚙️ المتطلبات

- Node.js 18+
- MongoDB Atlas account (مجاني)
- Cloudinary account (مجاني)

---

## 🚀 تشغيل المشروع

### 1. الواجهة الخلفية (Backend)

```bash
cd agyaal-backend
npm install

# انسخ ملف البيئة
cp .env.example .env
```

**عدّل ملف `.env` بالقيم الصحيحة:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/agyaal-store
JWT_SECRET=اكتب_هنا_مفتاح_سري_طويل
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

```bash
# أضف بيانات أولية (admin + فئات)
node seed.js

# شغّل السيرفر
npm run dev        # development
npm start          # production
```

السيرفر يعمل على: `http://localhost:5000`

---

### 2. الواجهة الأمامية (Frontend)

```bash
cd agyaal-frontend
npm install

# انسخ ملف البيئة
cp .env.local.example .env.local
```

**عدّل `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev        # development → http://localhost:3000
npm run build      # إنشاء نسخة الإنتاج
npm start          # تشغيل نسخة الإنتاج
```

---

## 🔑 بيانات الدخول الافتراضية (بعد seed)

| الدور    | البريد الإلكتروني    | كلمة المرور |
|----------|---------------------|-------------|
| Admin    | admin@agyaal.com    | admin123456 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint              | الوصف              | الوصول |
|--------|-----------------------|--------------------|--------|
| POST   | `/api/auth/register`  | تسجيل مستخدم جديد  | عام    |
| POST   | `/api/auth/login`     | تسجيل الدخول        | عام    |
| GET    | `/api/auth/me`        | بيانات المستخدم     | مسجل  |
| PUT    | `/api/auth/profile`   | تعديل الملف الشخصي  | مسجل  |

### Products
| Method | Endpoint              | الوصف               | الوصول |
|--------|-----------------------|---------------------|--------|
| GET    | `/api/products`       | جلب المنتجات        | عام    |
| GET    | `/api/products/:id`   | تفاصيل منتج         | عام    |
| POST   | `/api/products`       | إضافة منتج          | Admin  |
| PUT    | `/api/products/:id`   | تعديل منتج          | Admin  |
| DELETE | `/api/products/:id`   | حذف منتج            | Admin  |

### Categories
| Method | Endpoint                 | الوصف       | الوصول |
|--------|--------------------------|-------------|--------|
| GET    | `/api/categories`        | كل الفئات   | عام    |
| POST   | `/api/categories`        | إضافة فئة   | Admin  |
| PUT    | `/api/categories/:id`    | تعديل فئة   | Admin  |
| DELETE | `/api/categories/:id`    | حذف فئة     | Admin  |

### Cart
| Method | Endpoint             | الوصف               | الوصول |
|--------|----------------------|---------------------|--------|
| GET    | `/api/cart`          | جلب العربة           | مسجل  |
| POST   | `/api/cart`          | إضافة للعربة         | مسجل  |
| PUT    | `/api/cart/:itemId`  | تعديل الكمية         | مسجل  |
| DELETE | `/api/cart/:itemId`  | حذف عنصر             | مسجل  |
| DELETE | `/api/cart/clear`    | مسح العربة           | مسجل  |

### Orders
| Method | Endpoint                    | الوصف              | الوصول |
|--------|-----------------------------|--------------------|--------|
| POST   | `/api/orders`               | إنشاء طلب           | مسجل  |
| GET    | `/api/orders/myorders`      | طلباتي              | مسجل  |
| GET    | `/api/orders/:id`           | تفاصيل طلب          | مسجل  |
| GET    | `/api/orders`               | كل الطلبات          | Admin  |
| PUT    | `/api/orders/:id/status`    | تحديث حالة الطلب    | Admin  |

### Users & Reviews
| Method | Endpoint                  | الوصف              | الوصول |
|--------|---------------------------|--------------------|----|
| GET    | `/api/users`              | كل المستخدمين       | Admin |
| PUT    | `/api/users/:id/role`     | تغيير الدور         | Admin |
| DELETE | `/api/users/:id`          | حذف مستخدم          | Admin |
| GET    | `/api/reviews/:productId` | تقييمات منتج        | عام  |
| POST   | `/api/reviews/:productId` | إضافة تقييم         | مسجل |
| DELETE | `/api/reviews/:id`        | حذف تقييم           | مسجل |

---

## 📱 صفحات الموقع

### للعملاء
| الصفحة          | الرابط              |
|-----------------|---------------------|
| الرئيسية        | `/`                 |
| المتجر          | `/shop`             |
| تفاصيل المنتج  | `/product/[id]`     |
| العربة          | `/cart`             |
| إتمام الطلب    | `/checkout`         |
| طلباتي          | `/orders`           |
| تفاصيل الطلب   | `/orders/[id]`      |
| تسجيل الدخول   | `/login`            |
| إنشاء حساب     | `/register`         |
| تواصل معنا     | `/help`             |

### للمسؤولين
| الصفحة              | الرابط                      |
|---------------------|-----------------------------|
| لوحة التحكم         | `/dashboard`                |
| إدارة المنتجات     | `/dashboard/products`       |
| إدارة الفئات       | `/dashboard/categories`     |
| إدارة الطلبات      | `/dashboard/orders`         |
| إدارة المستخدمين   | `/dashboard/users`          |

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** (التصميم)
- **Axios** (API calls)
- **React Hot Toast** (الإشعارات)
- **React Icons** (الأيقونات)
- **js-cookie** (إدارة التوكن)

### Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT** (المصادقة)
- **bcryptjs** (تشفير كلمات المرور)
- **Cloudinary + Multer** (رفع الصور)
- **express-async-handler**

---

## 👥 فريق العمل — MIS-14

| الاسم                   | الكود   |
|------------------------|---------|
| لين احمد دريدي          | 521881  |
| محمود وائل فوزي         | 521555  |
| محمد ياسر محمود         | 521697  |
| رشاد احمد رشاد          | 521883  |
| علي عزت مصطفى           | 520418  |
| محمد الشربيني زهران     | 521599  |
| رامي محمد السيد         | 521685  |
| رحمة عبد المنعم محمود   | 521612  |
| رقية رضا محمودي         | 521130  |

**إشراف:** د/ هشام جميل — د/ ريهام الشامي

---

## 🎓 معهد العبور العالي للإدارة والحاسبات ونظم المعلومات — 2024/2025
