import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-heading font-bold text-primary-200 mb-2">404</p>
      <h1 className="font-heading text-3xl font-bold text-dark-900 mb-3">الصفحة غير موجودة</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
      </p>
      <Link href="/" className="btn-primary px-8 py-4">
        العودة للرئيسية
      </Link>
    </div>
  );
}
