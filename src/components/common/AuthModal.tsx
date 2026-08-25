import React, { useState } from 'react';
import { X, MessageSquare, User, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithName } = useAuth();
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (!clean) {
      setError('Mohon masukkan nama Anda.');
      return;
    }
    if (clean.length < 2) {
      setError('Nama minimal 2 karakter.');
      return;
    }
    loginWithName(clean, phoneInput);
    setNameInput('');
    setPhoneInput('');
    setError('');
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-[#E7E7E7] shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95"
        id="auth-identity-modal"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#667085] hover:text-[#242424] hover:bg-[#FAFAF9] rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#242424] tracking-tight">
            Identitas Pelanggan
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-xs mx-auto">
            Masukkan nama Anda untuk memulai obrolan dan bertransaksi langsung dengan penjual.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs text-center font-medium border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[#242424]">
              Nama Lengkap <span className="text-[#8F1D2C]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setError('');
                  setNameInput(e.target.value);
                }}
                placeholder="Contoh: Budi Santoso"
                className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white transition-all shadow-2xs"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-[#242424]">
              No. WhatsApp / HP <span className="text-[11px] font-normal text-[#667085]">(Opsional)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white transition-all shadow-2xs"
              />
            </div>
            <p className="text-[11px] text-[#667085]">
              Untuk memudahkan penjual menghubungi saat konfirmasi pesanan / pengiriman.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              id="auth-submit-name-btn"
            >
              <span>Mulai Chat & Simpan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E7E7E7] text-center">
          <p className="text-[11px] text-[#667085] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D5B]" />
            <span>Tanpa password rumit. Anda langsung terhubung dengan penjual.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
