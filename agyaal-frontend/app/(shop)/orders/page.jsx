"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { orderService } from "@/lib/services";
import { formatPrice, orderStatusLabel } from "@/lib/helpers";
import { useAuth } from "@/context/AuthContext";
import { FiPackage } from "react-icons/fi";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    orderService.getMyOrders()
      .then((r) => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="section text-center py-24">
      <p className="text-5xl mb-4">🔒</p>
      <Link href="/login" className="btn-primary">تسجيل الدخول</Link>
    </div>
  );

  if (loading) return (
    <div className="section space-y-4">
      {[1,2,3].map((i) => <div key={i} className="skeleton h-32 rounded-3xl" />)}
    </div>
  );

  return (
    <div className="section">
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-8">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <FiPackage className="text-6xl text-primary-200 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-3">لا توجد طلبات بعد</h2>
          <Link href="/shop" className="btn-primary">ابدأ التسوق</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = orderStatusLabel[order.orderStatus];
            return (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <div className="card p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">رقم الطلب</p>
                      <p className="font-mono text-sm font-medium text-dark-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">التاريخ</p>
                      <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">المنتجات</p>
                      <p className="text-sm font-medium">{order.items.length} منتج</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">الإجمالي</p>
                      <p className="font-bold text-primary-600">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <span className={`badge ${status?.color}`}>{status?.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
