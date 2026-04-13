"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { name, email, phone, password, confirm } = form;
    if (!name || !email || !password) { toast.error("يرجى ملء الحقول المطلوبة"); return; }
    if (password !== confirm) { toast.error("كلمتا المرور غير متطابقتين"); return; }
    if (password.length < 6) { toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success("تم إنشاء الحساب بنجاح! 🎉");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في إنشاء الحساب");
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-8">
      <h1 className="font-heading text-2xl font-bold text-dark-900 mb-2">إنشاء حساب</h1>
      <p className="text-gray-500 text-sm mb-7">انضم لأجيال ستور واستمتع بتجربة تسوق مميزة</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">الاسم الكامل *</label>
          <input name="name" value={form.name} onChange={handle}
            className="input" placeholder="محمد أحمد" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">البريد الإلكتروني *</label>
          <input name="email" type="email" value={form.email} onChange={handle}
            className="input" placeholder="example@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">رقم الهاتف</label>
          <input name="phone" value={form.phone} onChange={handle}
            className="input" placeholder="01xxxxxxxxx" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">كلمة المرور *</label>
          <input name="password" type="password" value={form.password} onChange={handle}
            className="input" placeholder="6 أحرف على الأقل" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">تأكيد كلمة المرور *</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handle}
            className="input" placeholder="••••••••" />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="btn-primary w-full mt-6 py-4 disabled:opacity-60">
        {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-5">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="text-primary-600 font-medium hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
