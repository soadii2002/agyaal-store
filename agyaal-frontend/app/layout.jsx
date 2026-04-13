import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Agyaal Store | أجيال ستور",
  description: "متجر ملابس الأطفال - جودة وأناقة لكل الأعمار",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "DM Sans, sans-serif",
                  borderRadius: "16px",
                  background: "#1a0f00",
                  color: "#fff",
                },
                success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
