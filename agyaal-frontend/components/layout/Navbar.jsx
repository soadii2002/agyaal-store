"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiMessageSquare } from "react-icons/fi";
import { MdChildCare } from "react-icons/md";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/",      label: "الرئيسية" },
    { href: "/shop",  label: "المتجر" },
    { href: "/help",  label: "تواصل معنا" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-2xl text-primary-600">
            <MdChildCare className="text-3xl" />
            أجيال ستور
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-dark-800 hover:text-primary-600 font-medium transition-colors duration-150">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors">
              <FiShoppingCart className="text-xl text-dark-800" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-primary-500 text-white text-xs
                                 w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-xl
                             hover:bg-primary-100 transition-colors font-medium">
                  <FiUser />
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover
                                  border border-orange-100 overflow-hidden z-50">
                    <Link href="/orders" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-orange-50 transition-colors">
                      <FiPackage /> طلباتي
                    </Link>
                    <Link href="/messages" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-orange-50 transition-colors">
                      <FiMessageSquare /> رسائلي 
                    </Link>
                    {isAdmin && (
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-orange-50 transition-colors text-primary-600 font-medium">
                        <FiUser /> لوحة التحكم
                      </Link>
                    )}
                    <hr className="border-orange-100" />
                    <button onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-red-500
                                 hover:bg-red-50 transition-colors w-full">
                      <FiLogOut /> تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm py-2 px-4">
                دخول
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-xl hover:bg-orange-50"
              onClick={() => setOpen(!open)}>
              {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-orange-100 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-orange-50 font-medium text-dark-800 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
