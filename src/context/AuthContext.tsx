import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { UserIdentity } from '../types';

interface AuthContextType {
  user: UserIdentity | null;
  firebaseUser: FirebaseUser | null;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
  loginWithGoogle: () => Promise<UserIdentity | null>;
  loginWithName: (name: string, phone?: string) => Promise<UserIdentity>;
  updateProfile: (data: Partial<UserIdentity>) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void) => void;
  isLoadingAuth: boolean;
}

const STORAGE_KEY_USER = 'bungatmin_user_identity_v2';
const STORAGE_KEY_ROLE = 'bungatmin_active_role_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && !parsed.id.startsWith('usr-guest-')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed loading cached user identity', e);
    }
    return null;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeRole, setActiveRoleState] = useState<'customer' | 'seller'>('customer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Sync to local storage for quick access
  useEffect(() => {
    try {
      if (user && !user.id.startsWith('usr-guest-')) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed saving user to storage', e);
    }
  }, [user]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !fbUser.isAnonymous) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let identity: UserIdentity;
          if (userDoc.exists()) {
            const data = userDoc.data();
            identity = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Pelanggan',
              email: data.email || fbUser.email || undefined,
              phone: data.phone || undefined,
              avatar:
                data.avatar ||
                fbUser.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  fbUser.displayName || fbUser.uid
                )}`,
              role: data.role || 'customer',
              createdAt: data.createdAt || Date.now(),
            };
          } else {
            const name = fbUser.displayName || 'Pelanggan';
            identity = {
              id: fbUser.uid,
              name: name,
              email: fbUser.email || undefined,
              avatar:
                fbUser.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
              role: 'customer',
              createdAt: Date.now(),
            };
            await setDoc(userDocRef, identity, { merge: true });
          }
          setUser(identity);
        } catch (err) {
          console.error('Failed fetching user profile from Firestore', err);
        }
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const setActiveRole = (role: 'customer' | 'seller') => {
    setActiveRoleState(role);
  };

  const loginWithGoogle = async (): Promise<UserIdentity | null> => {
    try {
      setIsLoadingAuth(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      const name = fbUser.displayName || 'Pelanggan Google';
      const avatar =
        fbUser.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      const identity: UserIdentity = {
        id: fbUser.uid,
        name: userDoc.exists() && userDoc.data().name ? userDoc.data().name : name,
        email: fbUser.email || undefined,
        phone: userDoc.exists() ? userDoc.data().phone : undefined,
        avatar: avatar,
        role: 'customer',
        createdAt: userDoc.exists() ? userDoc.data().createdAt : Date.now(),
      };

      await setDoc(
        userDocRef,
        {
          id: fbUser.uid,
          name: identity.name,
          email: fbUser.email || null,
          avatar: avatar,
          role: 'customer',
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      setUser(identity);
      setIsAuthModalOpen(false);

      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }

      return identity;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithName = async (nameInput: string, phoneInput?: string): Promise<UserIdentity> => {
    const cleanName = nameInput.trim();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;

    let userId = 'usr-guest-' + Date.now().toString(36);

    // Try signing in anonymously with Firebase to have a real auth session
    try {
      if (!auth.currentUser) {
        const anonRes = await signInAnonymously(auth);
        userId = anonRes.user.uid;
        await updateFirebaseProfile(anonRes.user, { displayName: cleanName });
      } else {
        userId = auth.currentUser.uid;
      }
    } catch (e) {
      console.warn('Anonymous firebase auth fallback to local UID', e);
    }

    const newUser: UserIdentity = {
      id: userId,
      name: cleanName,
      phone: phoneInput?.trim() || undefined,
      avatar: avatar,
      role: 'customer',
      createdAt: Date.now(),
    };

    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { ...newUser, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error('Error saving guest user to firestore', err);
    }

    setUser(newUser);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }

    return newUser;
  };

  const updateProfile = async (data: Partial<UserIdentity>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);

    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, { ...data, updatedAt: Date.now() }, { merge: true });
    } catch (err) {
      console.error('Error updating firestore user profile', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out', err);
    }
    setUser(null);
    setActiveRole('customer');
  };

  const openAuthModal = (onSuccess?: () => void) => {
    if (onSuccess) {
      setPendingCallback(() => onSuccess);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingCallback(null);
  };

  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      openAuthModal(action);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        activeRole,
        setActiveRole,
        loginWithGoogle,
        loginWithName,
        updateProfile,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        isLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
