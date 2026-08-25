import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, CustomerOrderData, Product } from '../types';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info';
  actionLabel?: string;
  onAction?: () => void;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, deltaOrExact: number, isDirect?: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  
  customerInfo: CustomerOrderData;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerOrderData>>;
  updateCustomerField: (field: keyof CustomerOrderData, value: string) => void;

  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  toasts: Toast[];
  addToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rumarasa_cart_items_v1';
const CUSTOMER_STORAGE_KEY = 'rumarasa_customer_data_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerOrderData>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        name: '',
        phone: '',
        city: '',
        address: '',
        notes: '',
      };
    } catch {
      return {
        name: '',
        phone: '',
        city: '',
        address: '',
        notes: '',
      };
    }
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving cart to localStorage', e);
    }
  }, [items]);

  // Sync customerInfo to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo));
    } catch (e) {
      console.error('Failed saving customer info to localStorage', e);
    }
  }, [customerInfo]);

  const addToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, message, actionLabel, onAction };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCustomerField = (field: keyof CustomerOrderData, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateItemUnitPrice = (product: Product, selectedVariants: Record<string, string>): number => {
    let price = product.discountPrice || product.price;
    if (product.variants) {
      product.variants.forEach((v) => {
        const chosen = selectedVariants[v.name];
        if (chosen && v.priceAdjustments && v.priceAdjustments[chosen]) {
          price += v.priceAdjustments[chosen];
        }
      });
    }
    return price;
  };

  const addItem = (product: Product, quantity = 1, selectedVariants: Record<string, string> = {}) => {
    const unitPrice = calculateItemUnitPrice(product, selectedVariants);
    const sortedVariantKey = Object.keys(selectedVariants).sort().map(k => `${k}:${selectedVariants[k]}`).join('|');
    const itemId = `${product.id}-${sortedVariantKey}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            quantity,
            selectedVariants,
            unitPrice,
          },
        ];
      }
    });

    addToast(`"${product.name}" berhasil ditambahkan ke keranjang`, 'Lihat Keranjang', () => {
      window.location.hash = '#/cart';
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    addToast('Item dihapus dari keranjang');
  };

  const updateQuantity = (itemId: string, val: number, isDirect = false) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = isDirect ? val : item.quantity + val;
            return {
              ...item,
              quantity: Math.max(1, nextQty),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        customerInfo,
        setCustomerInfo,
        updateCustomerField,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
