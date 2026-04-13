"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/lib/productService";
import { categoryService } from "@/lib/services";
import { getImageUrl } from "@/lib/helpers";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import { FiArrowLeft, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";

export default function HomePage() {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll({ featured: true, limit: 8 }),
      categoryService.getAll(),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.products);
      setCategories(cRes.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-primary-50 via-cream-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="badge bg-primary-100 text-primary-600 mb-4">✨ أجيال ستور</span>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-dark-900 leading-tight mb-6">
                ملابس أطفال
                <span className="text-primary-500 block">بلمسة مميزة</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
                اكتشف أحدث تصاميم ملابس الأطفال لجميع الأعمار. جودة عالية، أسعار مناسبة، وتوصيل سريع لباب بيتك.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary text-base px-8 py-4">
                  تسوق الآن
                </Link>
                <Link href="/shop" className="btn-outline text-base px-8 py-4">
                  استعرض الكولكشن
                </Link>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative hidden md:block">
              <div className="w-full aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-primary-100 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] rotate-6" />
                <Image
                  src="https://placehold.co/500x500/fef9ec/f97316?text=أجيال+ستور"
                  alt="Hero"
                  fill sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
            {[
              { icon: <FiTruck className="text-2xl" />,    title: "توصيل سريع",    desc: "لجميع أنحاء مصر" },
              { icon: <FiShield className="text-2xl" />,   title: "جودة مضمونة",   desc: "منتجات آمنة للأطفال" },
              { icon: <FiRefreshCw className="text-2xl" />,title: "إرجاع مرن",     desc: "خلال 14 يوم" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">{f.icon}</div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-primary-100 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="section">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-dark-900">تسوق حسب الفئة</h2>
            <Link href="/shop" className="btn-ghost flex items-center gap-1">
              عرض الكل <FiArrowLeft />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat._id} href={`/shop?category=${cat._id}`}>
                <div className="card p-4 flex flex-col items-center gap-3 hover:border-primary-300 border border-transparent transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 overflow-hidden relative">
                    <Image
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      fill sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-dark-800 text-center group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="section bg-cream-50 rounded-4xl mx-4 lg:mx-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold text-dark-900">منتجات مميزة</h2>
          <Link href="/shop" className="btn-ghost flex items-center gap-1">
            عرض الكل <FiArrowLeft />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? <ProductSkeleton count={8} /> : featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section">
        <div className="bg-dark-900 rounded-4xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fb923c 0%, transparent 50%)" }} />
          <div className="relative z-10">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">
              جديد كل يوم في أجيال ستور
            </h2>
            <p className="text-orange-300 mb-8 text-lg">اشترك واحصل على أحدث العروض والتخفيضات مباشرة</p>
            <Link href="/shop" className="btn-primary text-base px-10 py-4">
              اكتشف المجموعة الجديدة
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
