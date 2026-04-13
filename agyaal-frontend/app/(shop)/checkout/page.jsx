"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/lib/services";
import { formatPrice, GOVERNORATES } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    governorate: user?.address?.governorate || "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { name, phone, street, city, governorate } = form;
    if (!name || !phone || !street || !city || !governorate) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const res = await orderService.create({
        shippingAddress: { name, phone, street, city, governorate },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      await clearCart();
      toast.success("تم تأكيد طلبك بنجاح! 🎉");
      router.push(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في تأكيد الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="section text-center py-24">
      <p className="text-5xl mb-4">🔒</p>
      <Link href="/login" className="btn-primary">تسجيل الدخول</Link>
    </div>
  );

  if (!cart?.items?.length) return (
    <div className="section text-center py-24">
      <p className="text-5xl mb-4">🛒</p>
      <p className="text-gray-500 mb-4">عربتك فارغة</p>
      <Link href="/shop" className="btn-primary">تسوق الآن</Link>
    </div>
  );

  const SHIPPING = 50;

  return (
    <div className="section">
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-8">إتمام الطلب</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping info */}
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-5">بيانات التوصيل</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-1">الاسم الكامل *</label>
                <input name="name" value={form.name} onChange={handle} className="input" placeholder="محمد أحمد" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-1">رقم الهاتف *</label>
                <input name="phone" value={form.phone} onChange={handle} className="input" placeholder="01xxxxxxxxx" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark-800 mb-1">العنوان التفصيلي *</label>
                <input name="street" value={form.street} onChange={handle} className="input" placeholder="الشارع، رقم المبنى..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-1">المدينة *</label>
                <input name="city" value={form.city} onChange={handle} className="input" placeholder="الزقازيق" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-800 mb-1">المحافظة *</label>
                <select name="governorate" value={form.governorate} onChange={handle} className="input">
                  <option value="">اختر المحافظة</option>
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-5">طريقة الدفع</h2>
            <div className="space-y-3">
              {[
                { value: "cash_on_delivery", label: "💵 الدفع عند الاستلام" },
                { value: "online", label: "💳 الدفع الإلكتروني (قريباً)" },
              ].map((m) => (
                <label key={m.value}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${form.paymentMethod === m.value ? "border-primary-500 bg-primary-50" : "border-orange-100 hover:border-primary-200"}`}>
                  <input type="radio" name="paymentMethod" value={m.value}
                    checked={form.paymentMethod === m.value}
                    onChange={handle}
                    disabled={m.value === "online"}
                    className="accent-primary-500" />
                  <span className="font-medium">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-4">ملاحظات إضافية</h2>
            <textarea name="notes" value={form.notes} onChange={handle}
              rows={3} placeholder="أي تعليمات خاصة للتوصيل..."
              className="input resize-none" />
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-5">ملخص الطلب</h2>
            <div className="space-y-3 mb-5">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate ml-2">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-orange-100 pt-4 space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">المنتجات</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن</span>
                <span>{formatPrice(SHIPPING)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatPrice(totalPrice + SHIPPING)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full py-4 text-base disabled:opacity-60">
              {loading ? "جاري التأكيد..." : "تأكيد الطلب"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
