import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (
    message: string,
    actionLabel?: string,
    onAction?: () => void,
    type?: 'success' | 'info' | 'warning'
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    actionLabel?: string,
    onAction?: () => void,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const newToast: Toast = { id, message, actionLabel, onAction, type };

    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
