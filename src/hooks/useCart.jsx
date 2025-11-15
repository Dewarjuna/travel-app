import { useState, useCallback, useEffect } from 'react';
import { cartService } from '../api/services/cartService';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await cartService.list();
      setCartItems(cartData);
    } catch (err) {
      console.log('gagal load cart', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (activityId, quantity = 1) => {
    const res = await cartService.add(activityId, quantity);
    await fetchCart();
    console.log('berhasil tambah ke cart', { activityId, quantity });
    return res;
  }, [fetchCart]);

  const updateCartQuantity = useCallback(async (cartId, quantity) => {
    const res = await cartService.update(cartId, quantity);
    await fetchCart();
    console.log('quantity berubah', { cartId, quantity });
    return res;
  }, [fetchCart]);

  const removeFromCart = useCallback(async (cartId) => {
    const res = await cartService.remove(cartId);
    await fetchCart();
    console.log('item dihapus', { cartId });
    return res;
  }, [fetchCart]);

  return {
    cartItems,
    loading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
  };
}