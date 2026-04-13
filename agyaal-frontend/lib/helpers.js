// Format price in Egyptian Pounds
export const formatPrice = (price) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(price);

// Truncate text
export const truncate = (str, n = 60) =>
  str?.length > n ? str.slice(0, n) + "..." : str;

// Get absolute image url (handle local uploads)
export const getImageUrl = (url) => {
  if (!url) return "https://placehold.co/800x800/fef9ec/f97316?text=Image";
  if (url.startsWith("/")) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "") 
      : "http://localhost:5000";
    return `${backendUrl}${url}`;
  }
  return url;
};

// Get order status label (Arabic)
export const orderStatusLabel = {
  pending:    { label: "قيد الانتظار",   color: "bg-yellow-100 text-yellow-700" },
  processing: { label: "جاري التجهيز",  color: "bg-blue-100 text-blue-700" },
  shipped:    { label: "تم الشحن",       color: "bg-purple-100 text-purple-700" },
  delivered:  { label: "تم التسليم",    color: "bg-green-100 text-green-700" },
  cancelled:  { label: "ملغي",           color: "bg-red-100 text-red-700" },
};

// Age groups
export const AGE_GROUPS = [
  "0-3 أشهر", "3-6 أشهر", "6-12 شهر",
  "1-2 سنة", "2-3 سنوات", "3-5 سنوات", "5-8 سنوات",
];

// Sizes
export const SIZES = ["3M", "6M", "9M", "12M", "18M", "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"];

// Egyptian governorates
export const GOVERNORATES = [
  "القاهرة","الجيزة","الإسكندرية","الدقهلية","البحر الأحمر",
  "البحيرة","الفيوم","الغربية","الإسماعيلية","المنوفية",
  "المنيا","القليوبية","الوادي الجديد","السويس","أسوان",
  "أسيوط","بني سويف","بورسعيد","دمياط","الشرقية",
  "جنوب سيناء","كفر الشيخ","مطروح","الأقصر","قنا",
  "شمال سيناء","سوهاج",
];
