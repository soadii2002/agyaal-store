"use client";
import { useEffect, useState } from "react";
import { messageService } from "@/lib/services";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiClock, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MyMessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    if (user) {
      setLoading(true);
      messageService.getMyMessages()
        .then((res) => setMessages(res.data.data))
        .catch(() => toast.error("حدث خطأ أثناء جلب الرسائل"))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
    fetchMessages();
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <div className="section space-y-4">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-[400px] rounded-3xl" />
    </div>
  );

  return (
    <div className="section max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FiMessageSquare className="text-3xl text-primary-500" />
          <h1 className="font-heading text-3xl font-bold text-dark-900">رسائلي</h1>
        </div>
        <button onClick={fetchMessages} className="btn-ghost flex items-center gap-2 text-sm">
          <FiClock className={loading ? "animate-spin" : ""} /> تحديث
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          <p className="text-xl mb-4">ليس لديك أي رسائل سابقة ✉️</p>
          <button onClick={() => router.push("/help")} className="btn-primary mt-2">
            تواصل معنا الآن
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((m) => (
            <div key={m._id} className="card overflow-hidden">
              <div className="p-5 border-b border-orange-50 bg-orange-50/30 flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-1">{m.subject || "طلب مساعدة"}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiClock /> {new Date(m.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`badge px-3 py-1 flex items-center gap-1 ${
                  m.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                }`}>
                  {m.status === 'replied' ? (
                    <><FiCheckCircle /> تم الرد</>
                  ) : (
                    <><FiClock /> جاري المراجعة</>
                  )}
                </span>
              </div>
              
              <div className="p-5">
                <p className="text-dark-800 whitespace-pre-wrap">{m.message}</p>
                
                {m.status === 'replied' && m.replyMessage && (
                  <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-2xl relative">
                    <div className="absolute top-0 right-6 -mt-2 w-4 h-4 bg-primary-50 border-t border-r border-primary-100 transform -rotate-45"></div>
                    <p className="text-sm font-bold text-primary-800 mb-1">رد الإدارة:</p>
                    <p className="text-primary-700 whitespace-pre-wrap">{m.replyMessage}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
