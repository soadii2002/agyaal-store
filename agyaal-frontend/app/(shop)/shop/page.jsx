"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { productService } from "@/lib/productService";
import { categoryService } from "@/lib/services";
import ProductCard from "@/components/shop/ProductCard";
import ProductSkeleton from "@/components/shop/ProductSkeleton";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const LIMIT = 12;

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    ageGroup: "",
    minPrice: "",
    maxPrice: "",
    search:   "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.category) params.category = filters.category;
      if (filters.ageGroup) params.ageGroup = filters.ageGroup;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search)   params.search   = filters.search;

      const res = await productService.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { categoryService.getAll().then((r) => setCategories(r.data.categories)); }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ category: "", ageGroup: "", minPrice: "", maxPrice: "", search: "" });
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="section">
      <h1 className="font-heading text-4xl font-bold text-dark-900 mb-8">المتجر</h1>

      {/* Search bar */}
      <div className="relative mb-8">
        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          className="input pr-12 text-base"
        />
      </div>

      <div className="flex gap-8">
        {/* Sidebar - desktop */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-5 lg:hidden">
            <p className="text-sm text-gray-500">{total} منتج</p>
            <button onClick={() => setShowFilter(!showFilter)}
              className="btn-outline text-sm py-2 flex items-center gap-2">
              <FiFilter /> {showFilter ? "إخفاء الفلتر" : "فلترة"}
            </button>
          </div>

          {/* Mobile filter panel */}
          {showFilter && (
            <div className="card p-6 mb-6 lg:hidden">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Desktop count */}
          <p className="text-sm text-gray-500 mb-5 hidden lg:block">{total} منتج</p>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading
              ? <ProductSkeleton count={LIMIT} />
              : products.length === 0
                ? (
                  <div className="col-span-full text-center py-20">
                    <p className="text-6xl mb-4">👗</p>
                    <p className="text-gray-500 font-medium">لا توجد منتجات تطابق بحثك</p>
                    <button onClick={handleReset} className="btn-outline mt-4 text-sm">
                      إعادة ضبط الفلتر
                    </button>
                  </div>
                )
                : products.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-40">
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors
                    ${page === p ? "bg-primary-500 text-white" : "hover:bg-orange-50 text-dark-800"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-40">
                التالي
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
