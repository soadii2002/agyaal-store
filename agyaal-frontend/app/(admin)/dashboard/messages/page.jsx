"use client";
import { useEffect, useState } from "react";
import { messageService } from "@/lib/services";
import toast from "react-hot-toast";

export default function MessagesDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = () => {
    setLoading(true);
    messageService.getAll()
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((err) => toast.error("حدث خطأ أثناء جلب الرسائل"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error("يرجى كتابة الرد");
    try {
      await messageService.reply(selectedMessage._id, replyText);
      toast.success("تم الرد على الرسالة بنجاح");
      setSelectedMessage(null);
      setReplyText("");
      fetchMessages();
    } catch (error) {
      toast.error("حدث خطأ أثناء الرد");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await messageService.delete(id);
      toast.success("تم حذف الرسالة");
      if (selectedMessage?._id === id) setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-[400px] rounded-3xl" />
    </div>
  );

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-dark-900 mb-6">رسائل الدعم الفني</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="p-4 border-b border-orange-50 bg-orange-50/50">
            <h2 className="font-bold">كل الرسائل ({messages.length})</h2>
          </div>
          <div className="divide-y divide-orange-50 max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="p-8 text-center text-gray-400">لا توجد رسائل حالياً</p>
            ) : (
              messages.map((m) => (
                <div key={m._id} 
                  onClick={() => { setSelectedMessage(m); setReplyText(""); }}
                  className={`p-4 cursor-pointer hover:bg-orange-50/50 transition-colors ${selectedMessage?._id === m._id ? 'bg-orange-50' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-dark-900 truncate">{m.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      m.status === 'unread' ? 'bg-red-100 text-red-600' : 
                      m.status === 'replied' ? 'bg-green-100 text-green-600' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {m.status === 'unread' ? 'جديدة' : m.status === 'replied' ? 'تم الرد' : 'مقروءة'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mb-2">{m.subject || "بدون موضوع"}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details & Reply */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card p-6">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-orange-50">
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-1">{selectedMessage.subject || "بدون موضوع"}</h2>
                  <p className="text-sm text-gray-500">من: {selectedMessage.name} ({selectedMessage.email})</p>
                </div>
                <button onClick={() => handleDelete(selectedMessage._id)} className="text-red-500 hover:text-red-600 text-sm font-medium">
                  حذف الرسالة
                </button>
              </div>
              
              <div className="bg-cream-50 p-4 rounded-2xl mb-6">
                <p className="whitespace-pre-wrap text-dark-900">{selectedMessage.message}</p>
              </div>

              {selectedMessage.status === 'replied' ? (
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
                  <h3 className="text-sm font-bold text-green-800 mb-2">رد الإدارة:</h3>
                  <p className="text-green-700 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold mb-3">إرسال رد</h3>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="اكتب ردك هنا..."
                    className="input resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button onClick={handleReply} className="btn-primary px-6 py-2">
                      إرسال الرد
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full min-h-[400px] flex items-center justify-center text-gray-400">
              اختر رسالة لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
