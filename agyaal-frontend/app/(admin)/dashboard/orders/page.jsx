"use client";
import { useEffect, useState } from "react";
import { orderService } from "@/lib/services";
import { formatPrice, orderStatusLabel } from "@/lib/helpers";
import toast from "react-hot-toast";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAll()
      .then((r) => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await orderService.updateStatus(orderId, { orderStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus } : o));
      toast.success("تم تحديث حالة الطلب");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-8">إدارة الطلبات</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-orange-100">
              <tr>
                {["رقم الطلب","العميل","المنتجات","الإجمالي","طريقة الدفع","الحالة","التاريخ"].map((h) => (
                  <th key={h} className="px-4 py-4 text-right font-semibold text-dark-800">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-20 rounded-full" /></td>
                    ))}
                  </tr>
                ))
                : orders.map((o) => {
                  const s = orderStatusLabel[o.orderStatus];
                  return (
                    <tr key={o._id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs font-medium">#{o._id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{o.user?.name || "—"}</p>
                        <p className="text-gray-400 text-xs">{o.user?.email}</p>
                      </td>
                      <td className="px-4 py-4 text-center">{o.items.length}</td>
                      <td className="px-4 py-4 font-bold text-primary-600">{formatPrice(o.totalPrice)}</td>
                      <td className="px-4 py-4 text-gray-500">
                        {o.paymentMethod === "cash_on_delivery" ? "عند الاستلام" : "إلكتروني"}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="border border-orange-200 rounded-xl px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-300">
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{orderStatusLabel[s]?.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        {new Date(o.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
