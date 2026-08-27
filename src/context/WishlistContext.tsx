import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_KEY = 'bungatmin_wishlist_ids_v2';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isInitialLoadFromFirestore = useRef(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync from Firestore when user logs in
  useEffect(() => {
    if (!user) return;

    const loadWishlistFromFirestore = async () => {
      try {
        const wishDocRef = doc(db, 'users', user.id, 'wishlist', 'data');
        const wishSnap = await getDoc(wishDocRef);

        if (wishSnap.exists()) {
          const data = wishSnap.data();
          if (data.productIds) {
            const parsed =
              typeof data.productIds === 'string'
                ? JSON.parse(data.productIds)
                : data.productIds;
            if (Array.isArray(parsed)) {
              setWishlistIds(parsed);
            }
          }
        } else if (wishlistIds.length > 0) {
          await setDoc(wishDocRef, {
            userId: user.id,
            productIds: JSON.stringify(wishlistIds),
            updatedAt: Date.now(),
          });
        }
        isInitialLoadFromFirestore.current = true;
      } catch (err) {
        console.error('Error fetching wishlist from firestore', err);
      }
    };

    loadWishlistFromFirestore();
  }, [user?.id]);

  // Sync to local storage & Firestore
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }

    if (user && isInitialLoadFromFirestore.current) {
      const wishDocRef = doc(db, 'users', user.id, 'wishlist', 'data');
      setDoc(
        wishDocRef,
        {
          userId: user.id,
          productIds: JSON.stringify(wishlistIds),
          updatedAt: Date.now(),
        },
        { merge: true }
      ).catch((err) => console.warn('Firestore wishlist update fallback:', err));
    }
  }, [wishlistIds, user?.id]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
  };

  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
