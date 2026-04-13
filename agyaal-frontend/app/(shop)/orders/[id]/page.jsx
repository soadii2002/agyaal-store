"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { orderService } from "@/lib/services";
import { formatPrice, orderStatusLabel, getImageUrl } from "@/lib/helpers";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

const STEPS = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id)
      .then((r) => setOrder(r.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="section space-y-4">
      <div className="skeleton h-12 w-1/3 rounded-2xl" />
      <div className="skeleton h-40 rounded-3xl" />
    </div>
  );

  if (!order) return (
    <div className="section text-center py-20">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-gray-500">الطلب غير موجود</p>
      <Link href="/orders" className="btn-primary mt-4 inline-block">طلباتي</Link>
    </div>
  );

  const status = orderStatusLabel[order.orderStatus];
  const stepIdx = STEPS.indexOf(order.orderStatus);

  return (
    <div className="section">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">تفاصيل الطلب</h1>
          <p className="text-gray-400 text-sm mt-1">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`badge text-base px-4 py-2 ${status?.color}`}>{status?.label}</span>
      </div>

      {/* Progress tracker */}
      {order.orderStatus !== "cancelled" && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-orange-100 rounded-full -z-0" />
            <div
              className="absolute top-5 right-[10%] h-1 bg-primary-400 rounded-full -z-0 transition-all duration-500"
              style={{ width: `${(stepIdx / (STEPS.length - 1)) * 80}%` }}
            />
            {STEPS.map((s, i) => {
              const done = i <= stepIdx;
              const labels = { pending: "قيد الانتظار", processing: "جاري التجهيز", shipped: "تم الشحن", delivered: "تم التسليم" };
              return (
                <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${done ? "bg-primary-500 text-white" : "bg-orange-100 text-gray-400"}`}>
                    {done ? <FiCheckCircle /> : <span className="text-xs">{i + 1}</span>}
                  </div>
                  <p className="text-xs font-medium text-center w-16">{labels[s]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-heading text-xl font-bold mb-5">المنتجات</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <Image src={getImageUrl(item.image)}
                      alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark-900">{item.name}</p>
                    <p className="text-sm text-gray-400">المقاس: {item.size} • الكمية: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary-600">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Summary */}
          <div className="card p-5">
            <h3 className="font-heading font-bold mb-4">ملخص الطلب</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">المنتجات</span>
                <span>{formatPrice(order.totalPrice - order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الشحن</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-orange-100">
                <span>الإجمالي</span>
                <span className="text-primary-600">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-5">
            <h3 className="font-heading font-bold mb-3">عنوان التوصيل</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-dark-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}، {order.shippingAddress.governorate}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-heading font-bold mb-3">الدفع</h3>
            <p className="text-sm text-gray-600">
              {order.paymentMethod === "cash_on_delivery" ? "💵 الدفع عند الاستلام" : "💳 دفع إلكتروني"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
