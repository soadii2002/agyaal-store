import Link from "next/link";
import { MdChildCare } from "react-icons/md";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 font-heading font-bold text-3xl text-primary-600 mb-8">
        <MdChildCare className="text-4xl" />
        أجيال ستور
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
