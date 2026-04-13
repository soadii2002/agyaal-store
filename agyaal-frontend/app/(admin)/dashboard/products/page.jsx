"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { productService } from "@/lib/productService";
import { categoryService } from "@/lib/services";
import { formatPrice, AGE_GROUPS, SIZES, getImageUrl } from "@/lib/helpers";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const EMPTY = { name:"", description:"", price:"", discountPrice:"", category:"", ageGroup:"", stock:"", isFeatured:false, sizes:[] };

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [images,     setImages]     = useState([]);
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 100 }),
      categoryService.getAll(),
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.products);
      setCategories(cRes.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setImages([]); setModal(true); };
  const openEdit   = (p)  => {
    setEditing(p._id);
    setForm({ name:p.name, description:p.description, price:p.price, discountPrice:p.discountPrice||"",
              category:p.category?._id||"", ageGroup:p.ageGroup||"", stock:p.stock,
              isFeatured:p.isFeatured, sizes:p.sizes||[] });
    setImages([]);
    setModal(true);
  };

  const handleSize = (s) => setForm((f) => ({
    ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s]
  }));

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error("يرجى ملء الحقول المطلوبة"); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "sizes") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      images.forEach((img) => fd.append("images", img));

      if (editing) {
        const res = await productService.update(editing, fd);
        setProducts((p) => p.map((x) => x._id === editing ? res.data.product : x));
        toast.success("تم تحديث المنتج");
      } else {
        const res = await productService.create(fd);
        setProducts((p) => [res.data.product, ...p]);
        toast.success("تم إضافة المنتج");
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await productService.delete(id);
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success("تم حذف المنتج");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-900">إدارة المنتجات</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> إضافة منتج
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-orange-100">
              <tr>
                {["الصورة","المنتج","الفئة","السعر","المخزون","مميز","إجراءات"].map((h) => (
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
                : products.map((p) => (
                  <tr key={p._id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-4 py-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-100">
                        <Image src={getImageUrl(p.images?.[0])}
                          alt={p.name} fill sizes="(max-width: 768px) 100vw, 50px" className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-dark-900 max-w-[200px] truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.ageGroup}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{p.category?.name || "—"}</td>
                    <td className="px-4 py-4 font-bold text-primary-600">{formatPrice(p.discountPrice || p.price)}</td>
                    <td className="px-4 py-4">
                      <span className={`badge ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">{p.isFeatured ? "⭐" : "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 rounded-xl hover:bg-primary-50 text-primary-500 transition-colors">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">{editing ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-orange-50">
                <FiX />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">اسم المنتج *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  className="input" placeholder="اسم المنتج" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">الوصف *</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3} className="input resize-none" placeholder="وصف المنتج..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">السعر (جنيه) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})}
                  className="input" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">سعر الخصم</label>
                <input type="number" value={form.discountPrice} onChange={(e) => setForm({...form, discountPrice: e.target.value})}
                  className="input" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الفئة *</label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input">
                  <option value="">اختر الفئة</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الفئة العمرية</label>
                <select value={form.ageGroup} onChange={(e) => setForm({...form, ageGroup: e.target.value})} className="input">
                  <option value="">اختر الفئة العمرية</option>
                  {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الكمية المتاحة *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})}
                  className="input" placeholder="0" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="featured" checked={form.isFeatured}
                  onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
                  className="accent-primary-500 w-4 h-4" />
                <label htmlFor="featured" className="text-sm font-medium">منتج مميز</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">المقاسات</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => handleSize(s)}
                      className={`px-3 py-1 rounded-xl border text-xs font-medium transition-all
                        ${form.sizes.includes(s) ? "border-primary-500 bg-primary-50 text-primary-700" : "border-orange-200 hover:border-primary-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">صور المنتج</label>
                <input type="file" multiple accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input text-sm py-2" />
                {images.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{images.length} صورة محددة</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setModal(false)} className="btn-outline">إلغاء</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "جاري الحفظ..." : editing ? "حفظ التغييرات" : "إضافة المنتج"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
