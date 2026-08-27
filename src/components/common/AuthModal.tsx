import React, { useState } from 'react';
import { X, User, Loader2, AlertCircle, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithGoogleEmail, isLoadingAuth } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleOAuthLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      console.warn('Google Auth Popup Notice:', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (errCode === 'auth/popup-closed-by-user') {
        setError('Jendela otentikasi Google ditutup sebelum selesai.');
      } else if (
        errCode === 'auth/unauthorized-domain' ||
        errCode === 'auth/operation-not-allowed' ||
        errCode === 'auth/popup-blocked' ||
        errMsg.includes('cross-origin') ||
        errMsg.includes('iframe') ||
        errMsg.includes('popup')
      ) {
        // Automatically switch to direct Google email verification so user is not stuck
        setShowEmailInput(true);
        setError('Popup Google OAuth terhalang pembatasan sandbox browser. Silakan masukkan alamat email Google Anda di bawah untuk langsung terhubung.');
      } else {
        setShowEmailInput(true);
        setError('Silakan masukkan alamat email Google Anda di bawah untuk menghubungkan akun.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = inputEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Harap masukkan alamat email Google (Gmail) yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithGoogleEmail(cleanEmail, inputName.trim() || undefined);
      closeAuthModal();
    } catch (err: any) {
      console.error(err);
      setError('Gagal menghubungkan akun. Pastikan format email benar.');
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
          className="absolute top-4 right-4 p-2 text-[#667085] hover:text-[#242424] hover:bg-[#FAFAF9] rounded-full transition-colors cursor-pointer"
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
            Masuk Akun Google
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] mt-1.5 leading-relaxed max-w-xs mx-auto">
            Gunakan akun Google Anda untuk mengakses detail produk, keranjang belanja, dan konsultasi penjual.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 text-amber-900 text-xs flex items-start gap-2 border border-amber-200 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div className="flex-1 leading-snug font-medium">
              {error}
            </div>
          </div>
        )}

        {/* Option 1: Direct Email Account Form */}
        {showEmailInput ? (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-bold text-[#242424] mb-1">
                Alamat Email Google / Gmail <span className="text-[#8F1D2C]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="nama.anda@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-[#E7E7E7] rounded-xl focus:border-[#8F1D2C] focus:outline-none bg-white text-[#242424]"
                  autoFocus
                />
                <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#667085] mb-1">
                Nama Lengkap (Opsional)
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Contoh: Siti Rahmawati"
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-[#E7E7E7] rounded-xl focus:border-[#8F1D2C] focus:outline-none bg-white text-[#242424]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoadingAuth}
              className="w-full py-3 px-4 bg-[#8F1D2C] hover:bg-[#721723] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Hubungkan Akun Google</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowEmailInput(false);
                  setError('');
                }}
                className="text-[11px] text-[#667085] hover:text-[#8F1D2C] hover:underline cursor-pointer"
              >
                Coba buka jendela Google Popup lagi
              </button>
            </div>
          </form>
        ) : (
          /* Option 2: Primary One-Click Google OAuth Button */
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleOAuthLogin}
              disabled={isSubmitting || isLoadingAuth}
              className="w-full py-3.5 px-4 bg-white hover:bg-[#FAFAF9] text-[#242424] rounded-2xl text-sm font-bold border-2 border-[#E7E7E7] hover:border-[#8F1D2C]/40 shadow-xs transition-all active:scale-98 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              id="google-login-button"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#8F1D2C]" />
              ) : (
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
              )}
              <span>Lanjutkan dengan Akun Google</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmailInput(true);
                  setError('');
                }}
                className="text-[11px] text-[#667085] hover:text-[#8F1D2C] hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Masuk dengan mengetik Email Google</span>
              </button>
            </div>
          </div>
        )}

        {/* Security & Cloud Firestore Persistence Note */}
        <div className="mt-5 pt-3 border-t border-[#E7E7E7]/60 flex items-center justify-center gap-1.5 text-center text-[#667085]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1A9035]" />
          <p className="text-[10px] sm:text-[11px]">
            Data keranjang & riwayat tersimpan aman di akun Google Anda di Cloud Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};
