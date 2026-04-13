"use client";
import { useEffect, useState } from "react";
import { orderService, userService } from "@/lib/services";
import { productService } from "@/lib/productService";
import { formatPrice, orderStatusLabel } from "@/lib/helpers";
import Link from "next/link";
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";

export default function DashboardPage() {
  const [stats,   setStats]   = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 1 }),
      orderService.getAll(),
      userService.getAll(),
    ]).then(([pRes, oRes, uRes]) => {
      const allOrders = oRes.data.orders;
      const revenue   = allOrders
        .filter((o) => o.orderStatus !== "cancelled")
        .reduce((sum, o) => sum + o.totalPrice, 0);
      setStats({
        products: pRes.data.total,
        orders:   allOrders.length,
        users:    uRes.data.users.length,
        revenue,
      });
      setOrders(allOrders.slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: <FiBox />,         label: "المنتجات",    val: stats.products, color: "bg-blue-50 text-blue-600",    link: "/dashboard/products" },
    { icon: <FiShoppingBag />, label: "الطلبات",     val: stats.orders,   color: "bg-orange-50 text-orange-600",link: "/dashboard/orders" },
    { icon: <FiUsers />,       label: "المستخدمون",  val: stats.users,    color: "bg-green-50 text-green-600",  link: "/dashboard/users" },
    { icon: <FiDollarSign />,  label: "الإيرادات",   val: formatPrice(stats.revenue), color: "bg-primary-50 text-primary-600", link: "/dashboard/orders" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-8">لوحة التحكم</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c, i) => (
          <Link key={i} href={c.link}>
            <div className="card p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center text-xl mb-4`}>
                {c.icon}
              </div>
              <p className="text-2xl font-bold text-dark-900 mb-1">
                {loading ? <span className="skeleton inline-block w-16 h-7 rounded-xl" /> : c.val}
              </p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-bold">أحدث الطلبات</h2>
          <Link href="/dashboard/orders" className="btn-ghost text-sm">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orange-100">
                <th className="pb-3 text-right font-medium text-gray-500">رقم الطلب</th>
                <th className="pb-3 text-right font-medium text-gray-500">العميل</th>
                <th className="pb-3 text-right font-medium text-gray-500">الإجمالي</th>
                <th className="pb-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="pb-3 text-right font-medium text-gray-500">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="py-3"><div className="skeleton h-4 w-20 rounded-full" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.map((o) => {
                const s = orderStatusLabel[o.orderStatus];
                return (
                  <tr key={o._id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3">{o.user?.name || "—"}</td>
                    <td className="py-3 font-medium text-primary-600">{formatPrice(o.totalPrice)}</td>
                    <td className="py-3"><span className={`badge ${s?.color}`}>{s?.label}</span></td>
                    <td className="py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
