"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { cartService } from "@/lib/services";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart({ items: [] });
    setLoading(true);
    try {
      const res = await cartService.get();
      setCart(res.data.cart || { items: [] });
    } catch { setCart({ items: [] }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity, size) => {
    const res = await cartService.add({ productId, quantity, size });
    setCart(res.data.cart);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await cartService.update(itemId, quantity);
    setCart(res.data.cart);
  };

  const removeItem = async (itemId) => {
    const res = await cartService.remove(itemId);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await cartService.clear();
    setCart({ items: [] });
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const totalPrice = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, totalPrice, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
