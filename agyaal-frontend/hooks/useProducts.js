import { useState, useEffect, useCallback } from "react";
import { productService } from "@/lib/productService";

export function useProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [params,   setParams]   = useState(initialParams);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, total, loading, error, refetch: fetch, setParams };
}
