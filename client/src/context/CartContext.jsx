import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'hov_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 5000;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, { size = null, quantity = 1, variant = null } = {}) => {
    setItems((prev) => {
      const key = `${product._id || product.id}_${size || 'default'}`;
      const existingIndex = prev.findIndex((item) => item.cartKey === key);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem = {
        cartKey: key,
        product,
        size,
        variant,
        quantity,
        price: product.sellingPrice || product.mrp || 0,
      };
      return [...prev, newItem];
    });

    setIsOpen(true);
  };

  const removeFromCart = (cartKey) => {
    setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? (coupon.discountAmount || 0) : 0;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCharge = subtotal > 0 && !isFreeShipping ? 250 : 0;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingCharge);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        subtotal,
        discountAmount,
        coupon,
        setCoupon,
        isFreeShipping,
        shippingCharge,
        amountNeededForFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
