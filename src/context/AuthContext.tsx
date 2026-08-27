import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously,
  updateProfile as updateFirebaseProfile,
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
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<UserIdentity | null>;
  loginWithName: (name: string, phone?: string) => Promise<UserIdentity>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserIdentity>) => Promise<void>;
  requireAuth: (action: () => void) => void;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'bungatmin_user_identity_v2';

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

          if (userDoc.exists()) {
            const data = userDoc.data();
            const identity: UserIdentity = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Pelanggan Toko',
              email: data.email || fbUser.email || undefined,
              phone: data.phone || undefined,
              avatar:
                data.avatar ||
                fbUser.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.name || fbUser.displayName || 'Pelanggan'
                )}&background=8F1D2C&color=fff&bold=true`,
              role: data.role || 'customer',
              createdAt: data.createdAt || Date.now(),
            };
            setUser(identity);
          } else {
            // Check stored user from localStorage
            const stored = localStorage.getItem(STORAGE_KEY_USER);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.id) {
                setUser(parsed);
              }
            }
          }
        } catch (err) {
          console.error('Failed fetching user profile from Firestore', err);
        }
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const setActiveRole = (role: 'customer' | 'seller') => {
    setActiveRoleState(role);
  };

  const loginWithGoogle = async (
    customEmail?: string,
    customName?: string
  ): Promise<UserIdentity | null> => {
    try {
      setIsLoadingAuth(true);

      let fbUser: FirebaseUser | null = null;
      let displayName = customName?.trim() || '';
      let email = customEmail?.trim() || '';
      let photoURL = '';

      if (!customEmail && !customName) {
        // Attempt standard Google OAuth Popup
        const result = await signInWithPopup(auth, googleProvider);
        fbUser = result.user;
        displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Pelanggan Google';
        email = fbUser.email || '';
        photoURL = fbUser.photoURL || '';
      } else {
        // Custom Google identity provided by user
        try {
          if (!auth.currentUser) {
            const anonRes = await signInAnonymously(auth);
            fbUser = anonRes.user;
          } else {
            fbUser = auth.currentUser;
          }
        } catch (anonErr) {
          console.warn('Anonymous auth fallback error', anonErr);
        }

        displayName = customName?.trim() || (customEmail ? customEmail.split('@')[0] : 'Pelanggan Google');
        email = customEmail?.trim() || '';
      }

      const uid = fbUser?.uid || 'usr-google-' + Date.now().toString(36);

      if (!photoURL) {
        photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=8F1D2C&color=fff&bold=true`;
      }

      if (fbUser) {
        try {
          await updateFirebaseProfile(fbUser, {
            displayName,
            photoURL,
          });
        } catch (pErr) {
          console.warn('Could not update Firebase profile details:', pErr);
        }
      }

      // Check and save to Firestore
      const userDocRef = doc(db, 'users', uid);
      let existingPhone: string | undefined;

      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const docData = userDoc.data();
          if (docData.name && !customName) displayName = docData.name;
          if (docData.email && !customEmail) email = docData.email;
          if (docData.phone) existingPhone = docData.phone;
          if (docData.avatar) photoURL = docData.avatar;
        }
      } catch (docReadErr) {
        console.warn('Firestore doc read fallback', docReadErr);
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

      try {
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
      } catch (docWriteErr) {
        console.warn('Firestore user write fallback', docWriteErr);
      }

      setUser(identity);
      setIsAuthModalOpen(false);

      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }

      return identity;
    } catch (error: any) {
      console.error('Google Sign-In Execution Error:', error);
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithName = async (nameInput: string, phoneInput?: string): Promise<UserIdentity> => {
    const cleanName = nameInput.trim();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      cleanName
    )}&background=8F1D2C&color=fff&bold=true`;

    let userId = 'usr-google-' + Date.now().toString(36);

    try {
      if (!auth.currentUser) {
        const anonRes = await signInAnonymously(auth);
        userId = anonRes.user.uid;
        await updateFirebaseProfile(anonRes.user, { displayName: cleanName });
      } else {
        userId = auth.currentUser.uid;
      }
    } catch (e) {
      console.warn('Firebase auth fallback', e);
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
      console.error('Error saving user to firestore', err);
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
        loginWithName,
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
