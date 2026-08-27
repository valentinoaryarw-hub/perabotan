import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserIdentity>) => Promise<void>;
  requireAuth: (action: () => void) => void;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'bungatmin_user_identity_v3';

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
                  fbUser.displayName || 'Google User'
                )}&background=8F1D2C&color=fff&bold=true`,
              role: data.role || 'customer',
              createdAt: data.createdAt || Date.now(),
            };
          } else {
            // New user registration in Firestore
            identity = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Pengguna Google',
              email: fbUser.email || undefined,
              avatar:
                fbUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  fbUser.displayName || 'Google User'
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
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const setActiveRole = (role: 'customer' | 'seller') => {
    setActiveRoleState(role);
  };

  /**
   * Real Google OAuth Login
   * Authenticates the user's authentic Google Account via Firebase Auth
   * and registers/synchronizes their profile into Cloud Firestore
   */
  const loginWithGoogle = async (): Promise<UserIdentity> => {
    try {
      setIsLoadingAuth(true);

      // Trigger standard Google OAuth Popup
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
