"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { categoryService } from "@/lib/services";
import { getImageUrl } from "@/lib/helpers";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const EMPTY = { name: "", slug: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [image,      setImage]      = useState(null);
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    categoryService.getAll()
      .then((r) => setCategories(r.data.categories))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setImage(null); setModal(true); };
  const openEdit   = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, slug: c.slug });
    setImage(null);
    setModal(true);
  };

  const autoSlug = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const handleSubmit = async () => {
    if (!form.name || !form.slug) { toast.error("يرجى ملء الحقول المطلوبة"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      if (image) fd.append("image", image);

      if (editing) {
        const res = await categoryService.update(editing, fd);
        setCategories((c) => c.map((x) => x._id === editing ? res.data.category : x));
        toast.success("تم تحديث الفئة");
      } else {
        const res = await categoryService.create(fd);
        setCategories((c) => [res.data.category, ...c]);
        toast.success("تم إضافة الفئة");
      }
      setModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await categoryService.delete(id);
      setCategories((c) => c.filter((x) => x._id !== id));
      toast.success("تم حذف الفئة");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-900">إدارة الفئات</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> إضافة فئة
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-3xl" />)
          : categories.map((cat) => (
            <div key={cat._id} className="card p-5 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-100 flex-shrink-0">
                <Image
                  src={getImageUrl(cat.image)}
                  alt={cat.name} fill sizes="80px" className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark-900 truncate">{cat.name}</p>
                <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(cat)}
                  className="p-2 rounded-xl hover:bg-primary-50 text-primary-500 transition-colors">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(cat._id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">{editing ? "تعديل الفئة" : "إضافة فئة"}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-orange-50"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">اسم الفئة *</label>
                <input value={form.name}
                  onChange={(e) => setForm({ name: e.target.value, slug: autoSlug(e.target.value) })}
                  className="input" placeholder="مثال: ملابس يومية" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم المختصر (Slug) *</label>
                <input value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="input font-mono text-sm" placeholder="daily-clothes" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">صورة الفئة</label>
                <input type="file" accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="input text-sm py-2" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setModal(false)} className="btn-outline">إلغاء</button>
              <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "جاري الحفظ..." : editing ? "حفظ" : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
