"use client";
import { AGE_GROUPS } from "@/lib/helpers";

export default function FilterSidebar({ categories, filters, onChange, onReset }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-dark-900">تصفية النتائج</h3>
        <button onClick={onReset} className="text-xs text-primary-500 hover:underline">
          إعادة ضبط
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-sm text-dark-800 mb-3">الفئة</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" value=""
              checked={!filters.category}
              onChange={() => handle("category", "")}
              className="accent-primary-500" />
            <span className="text-sm">الكل</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="category" value={cat._id}
                checked={filters.category === cat._id}
                onChange={() => handle("category", cat._id)}
                className="accent-primary-500" />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age group */}
      <div>
        <h4 className="font-semibold text-sm text-dark-800 mb-3">الفئة العمرية</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="ageGroup" value=""
              checked={!filters.ageGroup}
              onChange={() => handle("ageGroup", "")}
              className="accent-primary-500" />
            <span className="text-sm">الكل</span>
          </label>
          {AGE_GROUPS.map((ag) => (
            <label key={ag} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="ageGroup" value={ag}
                checked={filters.ageGroup === ag}
                onChange={() => handle("ageGroup", ag)}
                className="accent-primary-500" />
              <span className="text-sm">{ag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-semibold text-sm text-dark-800 mb-3">السعر (جنيه)</h4>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="من"
            value={filters.minPrice || ""}
            onChange={(e) => handle("minPrice", e.target.value)}
            className="input text-sm py-2 w-full" />
          <span className="text-gray-400">-</span>
          <input type="number" placeholder="إلى"
            value={filters.maxPrice || ""}
            onChange={(e) => handle("maxPrice", e.target.value)}
            className="input text-sm py-2 w-full" />
        </div>
      </div>
    </aside>
  );
}
