"use client";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { formatPrice, truncate, getImageUrl } from "@/lib/helpers";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!product.sizes?.length) {
      toast.error("هذا المنتج لا يحتوي على مقاسات");
      return;
    }
    try {
      await addToCart(product._id, 1, product.sizes[0]);
      toast.success("تمت الإضافة للعربة!");
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    }
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount  = !!product.discountPrice;

  return (
    <Link href={`/product/${product._id}`}>
      <div className="card group cursor-pointer overflow-hidden">
        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden bg-cream-100">
          <Image
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            fill sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-3 right-3 badge bg-primary-500 text-white text-xs">
              خصم
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-dark-900 font-semibold px-4 py-2 rounded-full text-sm">
                نفذت الكمية
              </span>
            </div>
          )}
          {/* Quick add button */}
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-3 left-1/2 -translate-x-1/2
                         bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium
                         opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                         transition-all duration-300 whitespace-nowrap flex items-center gap-2 shadow-lg"
            >
              <FiShoppingCart /> أضف للعربة
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-primary-400 font-medium mb-1">
            {product.category?.name || ""}
          </p>
          <h3 className="font-heading font-semibold text-dark-900 text-base leading-snug mb-2">
            {truncate(product.name, 40)}
          </h3>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <FiStar className="text-yellow-400 fill-yellow-400 text-xs" />
              <span className="text-xs text-gray-500">
                {product.ratings.average} ({product.ratings.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-600 text-lg">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
