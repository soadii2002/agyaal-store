"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`أهلاً ${data.user.name}!`);
      router.push(data.user.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "بيانات الدخول غير صحيحة");
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-8">
      <h1 className="font-heading text-2xl font-bold text-dark-900 mb-2">تسجيل الدخول</h1>
      <p className="text-gray-500 text-sm mb-7">أهلاً بعودتك! أدخل بياناتك للمتابعة</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">البريد الإلكتروني</label>
          <input name="email" type="email" value={form.email} onChange={handle}
            className="input" placeholder="example@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-800 mb-1">كلمة المرور</label>
          <input name="password" type="password" value={form.password} onChange={handle}
            className="input" placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="btn-primary w-full mt-6 py-4 disabled:opacity-60">
        {loading ? "جاري الدخول..." : "دخول"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-5">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-primary-600 font-medium hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}
