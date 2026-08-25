import React from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#242424] text-white p-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3 animate-in slide-in-from-top-3 fade-in duration-200"
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-xs font-medium text-white/95 truncate">
              {toast.message}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  removeToast(toast.id);
                }}
                className="text-xs font-semibold text-[#F8E9EB] hover:text-white bg-[#8F1D2C] px-2.5 py-1 rounded-lg transition-colors"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
