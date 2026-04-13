"use client";
import { useEffect, useState } from "react";
import { userService } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { FiTrash2, FiShield } from "react-icons/fi";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAll()
      .then((r) => setUsers(r.data.users))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await userService.updateRole(id, newRole);
      setUsers((u) => u.map((x) => x._id === id ? { ...x, role: newRole } : x));
      toast.success("تم تحديث الصلاحية");
    } catch { toast.error("حدث خطأ"); }
  };

  const deleteUser = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await userService.delete(id);
      setUsers((u) => u.filter((x) => x._id !== id));
      toast.success("تم حذف المستخدم");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl font-bold text-dark-900">إدارة المستخدمين</h1>
        <span className="badge bg-primary-100 text-primary-700">{users.length} مستخدم</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-orange-100">
              <tr>
                {["الاسم","البريد الإلكتروني","الهاتف","الدور","تاريخ التسجيل","إجراءات"].map((h) => (
                  <th key={h} className="px-4 py-4 text-right font-semibold text-dark-800">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="skeleton h-4 w-24 rounded-full" /></td>
                    ))}
                  </tr>
                ))
                : users.map((u) => (
                  <tr key={u._id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-4 py-4 font-medium text-dark-900">{u.name}</td>
                    <td className="px-4 py-4 text-gray-500">{u.email}</td>
                    <td className="px-4 py-4 text-gray-500">{u.phone || "—"}</td>
                    <td className="px-4 py-4">
                      <span className={`badge ${u.role === "admin" ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.role === "admin" ? "مسؤول" : "مستخدم"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-4">
                      {u._id !== me._id && (
                        <div className="flex gap-2">
                          <button onClick={() => toggleRole(u._id, u.role)}
                            title={u.role === "admin" ? "إلغاء المسؤولية" : "منح المسؤولية"}
                            className="p-2 rounded-xl hover:bg-primary-50 text-primary-500 transition-colors">
                            <FiShield />
                          </button>
                          <button onClick={() => deleteUser(u._id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                            <FiTrash2 />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
