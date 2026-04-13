import Link from "next/link";
import { MdChildCare } from "react-icons/md";
import { FiFacebook, FiInstagram, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-orange-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-primary-400 mb-4">
              <MdChildCare className="text-3xl" />
              أجيال ستور
            </div>
            <p className="text-orange-300 text-sm leading-relaxed">
              متجرك الأول لملابس الأطفال — جودة، أمان، وأناقة لكل مرحلة من مراحل نمو طفلك.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="p-2 rounded-xl bg-dark-800 hover:bg-primary-600 transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="p-2 rounded-xl bg-dark-800 hover:bg-primary-600 transition-colors">
                <FiInstagram />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-lg">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/",      label: "الرئيسية" },
                { href: "/shop",  label: "المتجر" },
                { href: "/orders",label: "طلباتي" },
                { href: "/help",  label: "تواصل معنا" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-orange-300 hover:text-primary-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-lg">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-orange-300">
              <li className="flex items-center gap-2">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <span>+20 100 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <span>info@agyaal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-10 pt-6 text-center text-xs text-orange-400">
          © {new Date().getFullYear()} أجيال ستور. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
