import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  loginWithGoogle: () => Promise<UserIdentity | void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserIdentity>) => Promise<void>;
  requireAuth: (action: () => void) => void;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'bungatmin_user_identity_v5';

/**
 * Synchronizes Firebase User directly with Cloud Firestore document
 * under `users/{fbUser.uid}`
 */
export const syncUserProfileWithFirestore = async (fbUser: FirebaseUser): Promise<UserIdentity> => {
  const uid = fbUser.uid;
  const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Pelanggan Google';
  const email = fbUser.email || undefined;
  const photoURL =
    fbUser.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8F1D2C&color=fff&bold=true`;

  const userDocRef = doc(db, 'users', uid);
  let existingPhone: string | undefined;
  let role: 'customer' | 'seller' = 'customer';
  let createdAt = Date.now();

  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.phone) existingPhone = data.phone;
      if (data.role) role = data.role;
      if (data.createdAt) createdAt = data.createdAt;
    }
  } catch (err) {
    console.warn('Could not read existing user doc from Firestore:', err);
  }

  const identity: UserIdentity = {
    id: uid,
    name: displayName,
    email: email,
    phone: existingPhone,
    avatar: photoURL,
    role: role,
    createdAt: createdAt,
  };

  // Upsert profile in Cloud Firestore
  try {
    await setDoc(
      userDocRef,
      {
        id: uid,
        name: identity.name,
        email: identity.email || null,
        avatar: identity.avatar,
        role: identity.role,
        createdAt: identity.createdAt,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }

  return identity;
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

  // Cache user locally for seamless rendering while Firebase validates token
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

  // 1. Process Google OAuth redirect results on mount (for signInWithRedirect flow)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const identity = await syncUserProfileWithFirestore(result.user);
          setUser(identity);
          setFirebaseUser(result.user);
        }
      })
      .catch((error) => {
        console.warn('Redirect authentication result status:', error);
      });
  }, []);

  // 2. Listen to real-time Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const identity = await syncUserProfileWithFirestore(fbUser);
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
   * Official Google Sign-In using Firebase Authentication.
   * Tries `signInWithPopup` first; if blocked by browser sandbox/iframe, seamlessly falls back to `signInWithRedirect`.
   */
  const loginWithGoogle = async (): Promise<UserIdentity | void> => {
    try {
      setIsLoadingAuth(true);

      // Attempt 1: Standard Popup
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result && result.user) {
          const identity = await syncUserProfileWithFirestore(result.user);
          setUser(identity);
          setIsAuthModalOpen(false);

          if (pendingCallback) {
            pendingCallback();
            setPendingCallback(null);
          }

          return identity;
        }
      } catch (popupError: any) {
        const errorCode = popupError?.code || '';
        const errorMessage = popupError?.message || '';

        console.warn('Popup authentication notice:', errorCode, errorMessage);

        // Explicit errors that should NOT trigger redirect
        if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
          throw popupError;
        }

        if (errorCode === 'auth/unauthorized-domain') {
          throw popupError;
        }

        // If popup is blocked by browser, cross-origin/iframe sandbox, use redirect flow
        if (
          errorCode === 'auth/popup-blocked' ||
          errorMessage.includes('cross-origin') ||
          errorMessage.includes('sandbox') ||
          errorMessage.includes('iframe') ||
          errorMessage.includes('popup')
        ) {
          console.info('Switching to official Google OAuth redirect flow...');
          await signInWithRedirect(auth, googleProvider);
          return;
        }

        throw popupError;
      }
    } catch (error: any) {
      console.error('Google Sign-In Execution Error:', error);
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
      console.error('Error updating Firestore user profile', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out', err);
    }
    setUser(null);
    setFirebaseUser(null);
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
