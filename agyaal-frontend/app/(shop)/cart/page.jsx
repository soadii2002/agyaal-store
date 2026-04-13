"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getImageUrl } from "@/lib/helpers";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="section text-center py-24">
        <p className="text-6xl mb-4">🔒</p>
        <h2 className="font-heading text-2xl font-bold mb-3">سجل دخولك أولاً</h2>
        <p className="text-gray-500 mb-6">يجب عليك تسجيل الدخول لعرض عربة التسوق</p>
        <Link href="/login" className="btn-primary">تسجيل الدخول</Link>
      </div>
    );
  }

  if (loading) return (
    <div className="section space-y-4">
      {[1,2,3].map((i) => (
        <div key={i} className="skeleton h-28 rounded-3xl" />
      ))}
    </div>
  );

  if (!cart?.items?.length) return (
    <div className="section text-center py-24">
      <FiShoppingBag className="text-6xl text-primary-200 mx-auto mb-4" />
      <h2 className="font-heading text-2xl font-bold mb-3">عربتك فارغة</h2>
      <p className="text-gray-500 mb-6">لم تضف أي منتجات بعد</p>
      <Link href="/shop" className="btn-primary">تسوق الآن</Link>
    </div>
  );

  const SHIPPING = 50;

  return (
    <div className="section">
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-8">عربة التسوق</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-5 flex gap-4 items-center">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-cream-100 flex-shrink-0">
                <Image
                  src={getImageUrl(item.product?.images?.[0])}
                  alt={item.product?.name}
                  fill sizes="100px" className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark-900 truncate">{item.product?.name}</h3>
                <p className="text-sm text-gray-400 mb-2">المقاس: {item.size}</p>
                <p className="font-bold text-primary-600">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 bg-cream-100 rounded-2xl p-1">
                <button onClick={() => updateItem(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-orange-50 disabled:opacity-40">
                  <FiMinus className="text-xs" />
                </button>
                <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => updateItem(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm hover:bg-orange-50">
                  <FiPlus className="text-xs" />
                </button>
              </div>

              {/* Subtotal + Delete */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-dark-900">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item._id)}
                  className="text-red-400 hover:text-red-600 mt-2 transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-heading text-xl font-bold mb-6">ملخص الطلب</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">المنتجات</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن</span>
                <span className="font-medium">{formatPrice(SHIPPING)}</span>
              </div>
              <div className="border-t border-orange-100 pt-3 flex justify-between font-bold text-base">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatPrice(totalPrice + SHIPPING)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center block py-4">
              إتمام الطلب
            </Link>
            <Link href="/shop" className="btn-ghost w-full text-center mt-3 block">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
