import { useState, useEffect } from "react";
import { orderService } from "@/lib/services";

export function useMyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    orderService.getMyOrders()
      .then((r) => setOrders(r.data.orders))
      .catch((err) => setError(err.response?.data?.message || "حدث خطأ"))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
}

export function useOrder(id) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    orderService.getById(id)
      .then((r) => setOrder(r.data.order))
      .catch((err) => setError(err.response?.data?.message || "حدث خطأ"))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading, error };
}
