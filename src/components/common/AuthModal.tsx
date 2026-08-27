import React, { useState } from 'react';
import { X, User, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, isLoadingAuth } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await loginWithGoogle();
      if (result) {
        addToast(`Welcome, ${result.name}`, undefined, undefined, 'success');
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/unauthorized-domain') {
        setError(
          'Domain aplikasi ini belum didaftarkan di Authorized Domains Firebase Authentication. Silakan tambahkan domain ini pada Firebase Console.'
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setError('Jendela otentikasi Google ditutup sebelum proses masuk selesai.');
      } else if (code === 'auth/cancelled-popup-request') {
        setError('Permintaan masuk dengan Google dibatalkan.');
      } else if (code === 'auth/popup-blocked') {
        setError('Popup Google diblokir oleh browser. Sistem mengalihkan ke mode redirect Google OAuth.');
      } else if (code === 'auth/network-request-failed') {
        setError('Koneksi internet bermasalah. Harap periksa jaringan Anda dan coba lagi.');
      } else {
        setError(
          msg || 'Gagal terhubung dengan akun Google. Harap coba beberapa saat lagi.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl border border-[#E7E7E7] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95"
        id="auth-identity-modal"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 text-[#667085] hover:text-[#242424] hover:bg-[#FAFAF9] rounded-full transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto mb-3.5 shadow-xs font-bold">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#242424] tracking-tight">
            Masuk ke Toko Bu Ngatmin
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed max-w-xs mx-auto">
            Gunakan akun Google resmi Anda untuk mengelola troli belanja, wishlist, konsultasi chat, dan riwayat pesanan.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 text-red-700 text-xs flex items-start gap-2.5 border border-red-200 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isLoadingAuth}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#FAFAF9] text-[#242424] rounded-2xl text-sm font-bold border-2 border-[#E7E7E7] hover:border-[#8F1D2C]/40 shadow-xs transition-all active:scale-98 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            id="google-login-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#8F1D2C]" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Security & Firestore Persistence Note */}
        <div className="mt-5 pt-3 border-t border-[#E7E7E7]/60 flex items-center justify-center gap-1.5 text-center text-[#667085]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1A9035]" />
          <p className="text-[11px] text-[#667085]">
            Otentikasi resmi Google melalui Firebase Auth.
          </p>
        </div>
      </div>
    </div>
  );
};
