"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiPhone, FiMail, FiMapPin, FiSend } from "react-icons/fi";

import { messageService } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";

export default function HelpPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    try {
      await messageService.create(form);
      toast.success("تم إرسال رسالتك! سنرد عليك قريباً 📩");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div className="section">
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl font-bold text-dark-900 mb-3">تواصل معنا</h1>
        <p className="text-gray-500 max-w-md mx-auto">نحن هنا لمساعدتك! أرسل لنا رسالة وسنرد عليك في أقرب وقت</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: <FiPhone />, title: "اتصل بنا", val: "+20 100 000 0000" },
            { icon: <FiMail />,  title: "البريد الإلكتروني", val: "info@agyaal.com" },
            { icon: <FiMapPin />,title: "العنوان", val: "الزقازيق، الشرقية، مصر" },
          ].map((c, i) => (
            <div key={i} className="card p-5 flex gap-4 items-start">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-2xl text-xl flex-shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="font-semibold text-dark-900 mb-1">{c.title}</p>
                <p className="text-gray-500 text-sm">{c.val}</p>
              </div>
            </div>
          ))}

          {/* FAQ */}
          <div className="card p-5">
            <h3 className="font-heading font-bold mb-4 text-lg">أسئلة شائعة</h3>
            <div className="space-y-3 text-sm">
              {[
                { q: "كم يستغرق التوصيل؟", a: "2-5 أيام عمل لجميع أنحاء مصر" },
                { q: "هل يمكن الإرجاع؟",   a: "نعم، خلال 14 يوم من الاستلام" },
                { q: "ما طرق الدفع المتاحة؟", a: "الدفع عند الاستلام حالياً" },
              ].map((f, i) => (
                <div key={i} className="border-b border-orange-50 pb-3 last:border-0">
                  <p className="font-medium text-dark-900 mb-1">{f.q}</p>
                  <p className="text-gray-500">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 card p-8">
          <h2 className="font-heading text-2xl font-bold mb-6">أرسل رسالة</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم *</label>
              <input name="name" value={form.name} onChange={handle} className="input" placeholder="اسمك" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني *</label>
              <input name="email" type="email" value={form.email} onChange={handle} className="input" placeholder="email@example.com" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">الموضوع</label>
            <input name="subject" value={form.subject} onChange={handle} className="input" placeholder="موضوع رسالتك" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">الرسالة *</label>
            <textarea name="message" value={form.message} onChange={handle}
              rows={5} placeholder="اكتب رسالتك هنا..."
              className="input resize-none" />
          </div>
          <button onClick={handleSubmit}
            className="btn-primary flex items-center gap-2 px-8 py-4">
            <FiSend /> إرسال الرسالة
          </button>
        </div>
      </div>
    </div>
  );
}
