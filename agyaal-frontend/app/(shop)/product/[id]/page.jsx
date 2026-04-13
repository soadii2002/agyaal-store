"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { productService } from "@/lib/productService";
import { reviewService } from "@/lib/services";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, getImageUrl } from "@/lib/helpers";
import toast from "react-hot-toast";
import { FiShoppingCart, FiStar, FiMinus, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [product,  setProduct]  = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [size,     setSize]     = useState("");
  const [qty,      setQty]      = useState(1);
  const [adding,   setAdding]   = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      productService.getById(id),
      reviewService.getByProduct(id),
    ]).then(([pRes, rRes]) => {
      setProduct(pRes.data.product);
      setReviews(rRes.data.reviews);
      if (pRes.data.product.sizes?.length) setSize(pRes.data.product.sizes[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { router.push("/login"); return; }
    if (!size) { toast.error("اختر المقاس أولاً"); return; }
    setAdding(true);
    try {
      await addToCart(product._id, qty, size);
      toast.success("تمت الإضافة للعربة!");
    } catch { toast.error("حدث خطأ"); }
    finally { setAdding(false); }
  };

  const handleReviewSubmit = async () => {
    if (!user) { router.push("/login"); return; }
    setSubmitting(true);
    try {
      const res = await reviewService.create(id, newReview);
      setReviews((r) => [res.data.review, ...r]);
      setNewReview({ rating: 5, comment: "" });
      toast.success("تم إرسال تقييمك!");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="section grid md:grid-cols-2 gap-12">
      <div className="skeleton aspect-square rounded-3xl" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4 rounded-2xl" />
        <div className="skeleton h-5 w-1/2 rounded-2xl" />
        <div className="skeleton h-10 w-1/3 rounded-2xl" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="section text-center py-20">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-gray-500">المنتج غير موجود</p>
    </div>
  );

  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="section">
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-cream-100 mb-4">
            <Image
              src={getImageUrl(product.images?.[imgIdx])}
              alt={product.name}
              fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-colors
                    ${imgIdx === i ? "border-primary-500" : "border-transparent"}`}>
                  <Image src={getImageUrl(img)} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-primary-500 font-medium mb-2">{product.category?.name}</p>
          <h1 className="font-heading text-3xl font-bold text-dark-900 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              {[1,2,3,4,5].map((s) => (
                <FiStar key={s} className={`text-lg ${s <= Math.round(product.ratings.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
              ))}
              <span className="text-sm text-gray-500">({product.ratings.count} تقييم)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-bold text-primary-600 text-3xl">{formatPrice(displayPrice)}</span>
            {product.discountPrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Age group */}
          {product.ageGroup && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-dark-800">الفئة العمرية:</span>
              <span className="badge bg-primary-100 text-primary-700">{product.ageGroup}</span>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-dark-800 mb-3">المقاس:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
                      ${size === s ? "border-primary-500 bg-primary-50 text-primary-700" : "border-orange-200 hover:border-primary-300"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium text-dark-800">الكمية:</p>
            <div className="flex items-center gap-2 bg-cream-100 rounded-2xl p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 transition-colors">
                <FiMinus className="text-sm" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-orange-50 transition-colors">
                <FiPlus className="text-sm" />
              </button>
            </div>
            <span className="text-sm text-gray-400">({product.stock} متاح)</span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 disabled:opacity-60">
            <FiShoppingCart />
            {product.stock === 0 ? "نفذت الكمية" : adding ? "جاري الإضافة..." : "أضف إلى العربة"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-orange-100 pt-12">
        <h2 className="font-heading text-2xl font-bold text-dark-900 mb-8">التقييمات ({reviews.length})</h2>

        {/* Add review */}
        {user && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold mb-4">أضف تقييمك</h3>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onClick={() => setNewReview((r) => ({ ...r, rating: s }))}>
                  <FiStar className={`text-2xl transition-colors ${s <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="اكتب تعليقك هنا..."
              value={newReview.comment}
              onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
              className="input resize-none mb-4"
            />
            <button onClick={handleReviewSubmit} disabled={submitting} className="btn-primary">
              {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
          ) : reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-dark-900">{r.user?.name}</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <FiStar key={s} className={`text-sm ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
