import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useRef,
} from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem, CustomerOrderData, Product } from '../types';
import { useAuth } from './AuthContext';

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

const CART_STORAGE_KEY = 'bungatmin_cart_items_v2';
const CUSTOMER_STORAGE_KEY = 'bungatmin_customer_data_v2';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

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
      return saved
        ? JSON.parse(saved)
        : {
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
  const isInitialLoadFromFirestore = useRef(false);

  // Sync with Firestore whenever user logs in
  useEffect(() => {
    if (!user) return;

    const loadUserCartFromFirestore = async () => {
      try {
        const cartDocRef = doc(db, 'users', user.id, 'cart', 'data');
        const cartSnap = await getDoc(cartDocRef);

        if (cartSnap.exists()) {
          const data = cartSnap.data();
          if (data.items) {
            const parsedItems =
              typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
            if (Array.isArray(parsedItems) && parsedItems.length > 0) {
              setItems(parsedItems);
            }
          }
          if (data.customerInfo) {
            const parsedInfo =
              typeof data.customerInfo === 'string'
                ? JSON.parse(data.customerInfo)
                : data.customerInfo;
            if (parsedInfo && parsedInfo.name) {
              setCustomerInfo(parsedInfo);
            }
          }
        } else if (items.length > 0) {
          // If user logs in with items in local cart, sync them to firestore
          await setDoc(cartDocRef, {
            userId: user.id,
            items: JSON.stringify(items),
            customerInfo: JSON.stringify({
              ...customerInfo,
              name: customerInfo.name || user.name,
              phone: customerInfo.phone || user.phone || '',
            }),
            updatedAt: Date.now(),
          });
        }
        isInitialLoadFromFirestore.current = true;
      } catch (err) {
        console.error('Failed loading cart from firestore', err);
      }
    };

    loadUserCartFromFirestore();
  }, [user?.id]);

  // Sync cart to localStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving cart to localStorage', e);
    }

    if (user && isInitialLoadFromFirestore.current) {
      const cartDocRef = doc(db, 'users', user.id, 'cart', 'data');
      setDoc(
        cartDocRef,
        {
          userId: user.id,
          items: JSON.stringify(items),
          customerInfo: JSON.stringify(customerInfo),
          updatedAt: Date.now(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore cart update fallback:', err));
    }
  }, [items, user?.id]);

  // Sync customerInfo to localStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo));
    } catch (e) {
      console.error('Failed saving customer info to localStorage', e);
    }

    if (user && isInitialLoadFromFirestore.current) {
      const cartDocRef = doc(db, 'users', user.id, 'cart', 'data');
      setDoc(
        cartDocRef,
        {
          userId: user.id,
          customerInfo: JSON.stringify(customerInfo),
          updatedAt: Date.now(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore info update fallback:', err));
    }
  }, [customerInfo, user?.id]);

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

  const calculateItemUnitPrice = (
    product: Product,
    selectedVariants: Record<string, string>
  ): number => {
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

  const addItem = (
    product: Product,
    quantity = 1,
    selectedVariants: Record<string, string> = {}
  ) => {
    const unitPrice = calculateItemUnitPrice(product, selectedVariants);
    const sortedVariantKey = Object.keys(selectedVariants)
      .sort()
      .map((k) => `${k}:${selectedVariants[k]}`)
      .join('|');
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
