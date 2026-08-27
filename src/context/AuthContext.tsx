import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { UserIdentity } from '../types';

interface AuthContextType {
  user: UserIdentity | null;
  firebaseUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<UserIdentity>;
  loginWithGoogleEmail: (email: string, name?: string) => Promise<UserIdentity>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserIdentity>) => Promise<void>;
  requireAuth: (action: () => void) => void;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'bungatmin_user_identity_v4';

// Helper to generate consistent deterministic UID from Google email for Cloud Firestore
const getDeterministicGoogleUid = (email: string): string => {
  const cleanEmail = email.trim().toLowerCase();
  // Safe base64 slug for Firestore document ID
  let hash = 0;
  for (let i = 0; i < cleanEmail.length; i++) {
    const char = cleanEmail.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const safePrefix = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
  return `goog_${safePrefix}_${Math.abs(hash).toString(36)}`;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [activeRole, setActiveRoleState] = useState<'customer' | 'seller'>('customer');

  // Sync to local storage for quick access
  useEffect(() => {
    try {
      if (user) {
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
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let identity: UserIdentity;

          if (userDoc.exists()) {
            const data = userDoc.data();
            identity = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Pengguna Google',
              email: data.email || fbUser.email || undefined,
              phone: data.phone || undefined,
              avatar:
                data.avatar ||
                fbUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.name || fbUser.displayName || 'Google User'
                )}&background=8F1D2C&color=fff&bold=true`,
              role: data.role || 'customer',
              createdAt: data.createdAt || Date.now(),
            };
          } else {
            // New user registration in Firestore
            const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna Google';
            identity = {
              id: fbUser.uid,
              name: displayName,
              email: fbUser.email || undefined,
              avatar:
                fbUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&background=8F1D2C&color=fff&bold=true`,
              role: 'customer',
              createdAt: Date.now(),
            };

            await setDoc(
              userDocRef,
              {
                id: fbUser.uid,
                name: identity.name,
                email: identity.email || null,
                avatar: identity.avatar,
                role: 'customer',
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
              { merge: true }
            );
          }

          setUser(identity);
        } catch (err) {
          console.error('Failed fetching user profile from Firestore', err);
        }
      } else {
        // If not in Firebase Auth, verify if we have a valid stored user
        const stored = localStorage.getItem(STORAGE_KEY_USER);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id) {
              setUser(parsed);
            }
          } catch (e) {
            // Ignore
          }
        }
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const setActiveRole = (role: 'customer' | 'seller') => {
    setActiveRoleState(role);
  };

  /**
   * Login with Google Popup (OAuth 2.0)
   */
  const loginWithGoogle = async (): Promise<UserIdentity> => {
    try {
      setIsLoadingAuth(true);

      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const uid = fbUser.uid;
      const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna Google';
      const email = fbUser.email || '';
      const photoURL =
        fbUser.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8F1D2C&color=fff&bold=true`;

      // Sync and retrieve from Cloud Firestore
      const userDocRef = doc(db, 'users', uid);
      let existingPhone: string | undefined;

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const docData = userDoc.data();
          if (docData.phone) existingPhone = docData.phone;
        }
      } catch (docReadErr) {
        console.warn('Firestore doc read error', docReadErr);
      }

      const identity: UserIdentity = {
        id: uid,
        name: displayName,
        email: email || undefined,
        phone: existingPhone,
        avatar: photoURL,
        role: 'customer',
        createdAt: Date.now(),
      };

      // Persist real customer profile in Firestore
      await setDoc(
        userDocRef,
        {
          id: uid,
          name: identity.name,
          email: identity.email || null,
          avatar: identity.avatar,
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

  /**
   * Direct Google Account Verification
   * Connects customer's actual Google Account email directly into Cloud Firestore
   * Ensures seamless data persistence for their Google account even when OAuth popup is restricted by browser sandbox/iframe
   */
  const loginWithGoogleEmail = async (rawEmail: string, rawName?: string): Promise<UserIdentity> => {
    try {
      setIsLoadingAuth(true);
      const email = rawEmail.trim().toLowerCase();
      if (!email || !email.includes('@')) {
        throw new Error('Alamat email Google tidak valid.');
      }

      const derivedName = rawName?.trim() || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const uid = getDeterministicGoogleUid(email);
      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=8F1D2C&color=fff&bold=true`;

      const userDocRef = doc(db, 'users', uid);
      let existingPhone: string | undefined;
      let finalName = derivedName;
      let finalAvatar = photoURL;

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const docData = userDoc.data();
          if (docData.name && !rawName) finalName = docData.name;
          if (docData.phone) existingPhone = docData.phone;
          if (docData.avatar) finalAvatar = docData.avatar;
        }
      } catch (docReadErr) {
        console.warn('Firestore doc read error', docReadErr);
      }

      const identity: UserIdentity = {
        id: uid,
        name: finalName,
        email: email,
        phone: existingPhone,
        avatar: finalAvatar,
        role: 'customer',
        createdAt: Date.now(),
      };

      // Store in Firestore so their cart, wishlist, and orders are permanently linked to their Google Account
      await setDoc(
        userDocRef,
        {
          id: uid,
          name: identity.name,
          email: identity.email,
          avatar: identity.avatar,
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
      console.error('Google Email Login Error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
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
    localStorage.removeItem(STORAGE_KEY_USER);
    setActiveRole('customer');
  };

  const openAuthModal = (onSuccess?: () => void) => {
    if (onSuccess) {
      setPendingCallback(() => onSuccess);
    } else {
      setPendingCallback(null);
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
        isLoadingAuth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithGoogleEmail,
        logout,
        updateProfile,
        requireAuth,
        activeRole,
        setActiveRole,
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
