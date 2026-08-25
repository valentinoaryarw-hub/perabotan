import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserIdentity } from '../types';

interface AuthContextType {
  user: UserIdentity | null;
  activeRole: 'customer' | 'seller';
  setActiveRole: (role: 'customer' | 'seller') => void;
  loginWithName: (name: string, phone?: string) => UserIdentity;
  updateProfile: (data: Partial<UserIdentity>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void) => void;
}

const STORAGE_KEY_USER = 'rumarasa_user_identity_v3';
const STORAGE_KEY_ROLE = 'rumarasa_active_role_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserIdentity | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load user identity', e);
    }
    return null;
  });

  const [activeRole, setActiveRoleState] = useState<'customer' | 'seller'>('customer');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user identity', e);
    }
  }, [user]);

  const setActiveRole = (role: 'customer' | 'seller') => {
    setActiveRoleState(role);
  };

  const loginWithName = (nameInput: string, phoneInput?: string): UserIdentity => {
    const cleanName = nameInput.trim();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;

    const newUser: UserIdentity = {
      id: 'usr-' + Date.now().toString(36),
      name: cleanName,
      phone: phoneInput?.trim() || undefined,
      avatar: avatar,
      role: 'customer',
      createdAt: Date.now(),
    };

    setUser(newUser);
    setIsAuthModalOpen(false);

    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }

    return newUser;
  };

  const updateProfile = (data: Partial<UserIdentity>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const logout = () => {
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
        activeRole,
        setActiveRole,
        loginWithName,
        updateProfile,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        requireAuth,
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
