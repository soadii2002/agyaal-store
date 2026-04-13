"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { MdChildCare } from "react-icons/md";
import { FiHome, FiBox, FiTag, FiUsers, FiShoppingBag, FiLogOut, FiMessageSquare } from "react-icons/fi";

const links = [
  { href: "/dashboard",            icon: <FiHome />,       label: "الرئيسية" },
  { href: "/dashboard/products",   icon: <FiBox />,        label: "المنتجات" },
  { href: "/dashboard/categories", icon: <FiTag />,        label: "الفئات" },
  { href: "/dashboard/orders",     icon: <FiShoppingBag />,label: "الطلبات" },
  { href: "/dashboard/users",      icon: <FiUsers />,      label: "المستخدمون" },
  { href: "/dashboard/messages",   icon: <FiMessageSquare />, label: "الرسائل" },
];

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/login");
  }, [user, loading, isAdmin]);

  if (loading || !user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="skeleton w-10 h-10 rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-cream-50">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-900 text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-dark-800">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary-400">
            <MdChildCare className="text-2xl" /> أجيال ستور
          </Link>
          <p className="text-xs text-orange-400 mt-1">لوحة التحكم</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                  ${active ? "bg-primary-500 text-white" : "text-orange-200 hover:bg-dark-800"}`}>
                {l.icon} {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-800">
          <button onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-orange-200 hover:bg-dark-800 w-full transition-all">
            <FiLogOut /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 mr-60 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
