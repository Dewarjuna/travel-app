import { useState, useCallback, useEffect } from 'react';
import { cartService } from '../api/services/cartService';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await cartService.list();
      // always keep an array in state
      setCartItems(Array.isArray(cartData) ? cartData : []);
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

  // tambah one row to cart by activityId karena backend yang ngatur quantity default
  const addToCart = useCallback(
    async (activityId) => {
      const res = await cartService.add(activityId);
      await fetchCart();
      console.log('berhasil tambah ke cart (addToCart)', { activityId });
      return res;
    },
    [fetchCart],
  );

  // ngeset quantity berdasarkan cartid
  const updateCartQuantity = useCallback(
    async (cartId, quantity) => {
      const res = await cartService.update(cartId, quantity);
      await fetchCart();
      console.log('quantity berubah', { cartId, quantity });
      return res;
    },
    [fetchCart],
  );
  const removeFromCart = useCallback(
    async (cartId) => {
      try {
        const res = await cartService.remove(cartId);
        await fetchCart();
        console.log('item dihapus', { cartId });
        return res;
      } catch (err) {
        // buat ignore 404 not found
        if (err.response?.status === 404) {
          console.warn('cart item not found on delete, refreshing cart', {
            cartId,
          });
          await fetchCart();
          return null;
        }
        console.log('gagal hapus cart', err);
        throw err;
      }
    },
    [fetchCart],
  );

  // helper: set quantity yg sama berdasarkan activityid
  const setCartQuantityByActivity = useCallback(
    async (activityId, quantity) => {
      // kalau quantity <= 0, hapus item jika ada
      if (quantity <= 0) {
        const current = await cartService.list();
        const items = Array.isArray(current) ? current : [];
        const existingItem = items.find(
          (item) =>
            item.activityId === activityId || item.activity?.id === activityId,
        );
        if (existingItem) {
          await cartService.remove(existingItem.id);
          await fetchCart();
          console.log('item dihapus karena quantity <= 0', {
            cartId: existingItem.id,
          });
        }
        return;
      }

      // kalo ada, update, kalo gk ada, tambah dulu baru update
      const current = await cartService.list();
      const items = Array.isArray(current) ? current : [];

      const existingItem = items.find(
        (item) =>
          item.activityId === activityId || item.activity?.id === activityId,
      );

      if (!existingItem) {
        // kalo gk ada row, tambahin lewat add
        const addRes = await cartService.add(activityId);
        console.log('setCartQuantityByActivity (add first time)', {
          activityId,
          quantity,
          addRes,
        });

        if (quantity > 1) {
          // kalo mau lebih dari 1, fetch lagi terus update quantity
          const afterAdd = await cartService.list();
          const afterItems = Array.isArray(afterAdd) ? afterAdd : [];
          const newItem = afterItems.find(
            (item) =>
              item.activityId === activityId ||
              item.activity?.id === activityId,
          );
          if (newItem) {
            await cartService.update(newItem.id, quantity);
            console.log('setCartQuantityByActivity (update new item)', {
              cartId: newItem.id,
              quantity,
            });
          }
        }
      } else {
        // ada row, tinggal update quantity
        await cartService.update(existingItem.id, quantity);
        console.log('setCartQuantityByActivity (update existing)', {
          cartId: existingItem.id,
          quantity,
        });
      }

      await fetchCart();
    },
    [fetchCart],
  );

  // buat nambahin quantity ke existing quantity berdasarkan activityid
  const addQuantityByActivity = useCallback(
    async (activityId, addQuantity) => {
      // kalo gk, gk usah ngapa2in
      if (addQuantity <= 0) return;
      // get cart
      const current = await cartService.list();
      const items = Array.isArray(current) ? current : [];

      const existingItem = items.find(
        (item) =>
          item.activityId === activityId || item.activity?.id === activityId,
      );

      if (!existingItem) {
        // no row yet:
        // 1) create one via add-cart (backend sets default quantity, usually 1)
        const addRes = await cartService.add(activityId);
        console.log('addQuantityByActivity (add first time)', {
          activityId,
          addQuantity,
          addRes,
        });

        // 2) if user wants more than 1, fetch again and set quantity
        if (addQuantity > 1) {
          const afterAdd = await cartService.list();
          const afterItems = Array.isArray(afterAdd) ? afterAdd : [];
          const newItem = afterItems.find(
            (item) =>
              item.activityId === activityId ||
              item.activity?.id === activityId,
          );
          if (newItem) {
            await cartService.update(newItem.id, addQuantity);
            console.log('addQuantityByActivity (set new item quantity)', {
              cartId: newItem.id,
              quantity: addQuantity,
            });
          }
        }
      } else {
        // row exists: add to current quantity (21 + 2 = 23)
        const currentQty = existingItem.quantity || 0;
        const newQuantity = currentQty + addQuantity;
        await cartService.update(existingItem.id, newQuantity);
        console.log('addQuantityByActivity (update existing)', {
          cartId: existingItem.id,
          prevQuantity: currentQty,
          addQuantity,
          newQuantity,
        });
      }

      await fetchCart();
    },
    [fetchCart],
  );

  return {
    cartItems,
    loading,
    addToCart,              // basic add-one-row helper (increment by API default)
    updateCartQuantity,     // set exact quantity by cartId (Cart page +/-)
    removeFromCart,         // remove by cartId
    setCartQuantityByActivity, // set exact quantity by activityId
    addQuantityByActivity,  // add to existing quantity (ActivityDetail)
  };
}