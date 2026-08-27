import React, { useState } from 'react';
import { X, User, Loader2, Mail, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, isLoadingAuth } = useAuth();
  const [error, setError] = useState('');
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [showCustomEmail, setShowCustomEmail] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmittingGoogle(true);
    try {
      if (showCustomEmail) {
        if (!customName.trim()) {
          setError('Silakan masukkan nama lengkap Anda.');
          setIsSubmittingGoogle(false);
          return;
        }
        if (!customEmail.trim() || !customEmail.includes('@')) {
          setError('Silakan masukkan alamat email yang valid.');
          setIsSubmittingGoogle(false);
          return;
        }
        await loginWithGoogle(customEmail.trim(), customName.trim());
      } else {
        await loginWithGoogle();
      }
      closeAuthModal();
    } catch (err: any) {
      console.warn('Google login failed or popup blocked:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Jendela masuk Google ditutup.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup Google diblokir oleh browser. Silakan masukkan nama & email di bawah.');
        setShowCustomEmail(true);
      } else {
        setError('Popup otentikasi Google terhalang sandbox/browser. Masukkan nama & email Anda di bawah untuk langsung masuk.');
        setShowCustomEmail(true);
      }
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl border border-[#E7E7E7] shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95"
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
          <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto mb-3 shadow-xs font-bold">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#242424] tracking-tight">
            Masuk ke Toko Bu Ngatmin
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-xs mx-auto">
            Silakan masuk dengan akun Google Anda untuk melihat detail produk, belanja, dan berdiskusi dengan penjual.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Custom Email Form (Drawer) */}
        {showCustomEmail && (
          <div className="mb-4 p-3.5 bg-[#FAFAF9] border border-[#E7E7E7] rounded-2xl space-y-2.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-bold text-[#667085] mb-1">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3 py-2 text-xs border border-[#E7E7E7] rounded-xl focus:border-[#8F1D2C] focus:outline-none bg-white"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#667085] mb-1">
                Email Google Anda
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Contoh: budi@gmail.com"
                className="w-full px-3 py-2 text-xs border border-[#E7E7E7] rounded-xl focus:border-[#8F1D2C] focus:outline-none bg-white"
              />
            </div>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmittingGoogle || isLoadingAuth}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#FAFAF9] text-[#242424] rounded-2xl text-sm font-bold border-2 border-[#E7E7E7] hover:border-[#8F1D2C]/40 shadow-xs transition-all active:scale-98 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            id="google-login-button"
          >
            {isSubmittingGoogle ? (
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
            <span>
              {showCustomEmail ? 'Masuk dengan Akun Ini' : 'Lanjutkan dengan Akun Google'}
            </span>
          </button>
        </div>

        {/* Option to customize account details if needed */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setShowCustomEmail(!showCustomEmail);
              setError('');
            }}
            className="text-[11px] text-[#667085] hover:text-[#8F1D2C] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>
              {showCustomEmail
                ? 'Gunakan Jendela Masuk Google (Popup)'
                : 'Atau masukkan Nama & Email Google secara langsung'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
