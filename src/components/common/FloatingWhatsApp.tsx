import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { STORE_CONFIG } from '../../config/store';
import { createWhatsAppUrl, generateHelpInquiryMessage } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const text = customMsg.trim()
      ? customMsg.trim()
      : generateHelpInquiryMessage();
    const url = createWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  const directDefaultUrl = createWhatsAppUrl(generateHelpInquiryMessage());

  return (
    <aside aria-label="Customer Support Widget" className="fixed bottom-20 md:bottom-7 right-4 md:right-7 z-40 flex flex-col items-end">
      {/* Quick Consultation Popup Modal */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#E7E7E7] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#2E7D5B] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Customer Service Perabotan Bu Ngatmin</h4>
                <p className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online • Bu Ngatmin Siap Membantu
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Chat Bubble */}
          <div className="p-4 bg-[#F8FAF9] space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs text-xs text-[#242424] leading-relaxed border border-[#E7E7E7]">
              <p>
                Halo! Mau tanya perabot dapur, sapu, piring, ember, atau rekomendasi perlengkapan rumah tangga? Bu Ngatmin siap bantu ya!
              </p>
              <span className="text-[9px] text-[#667085] block text-right mt-1.5">
                Bu Ngatmin
              </span>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wider">
                Pertanyaan Cepat:
              </p>
              <button
                type="button"
                onClick={() => {
                  const url = createWhatsAppUrl('Halo Bu Ngatmin, saya ingin tanya stok perabotan dan estimasi ongkir ke alamat saya.');
                  window.open(url, '_blank');
                  setIsOpen(false);
                }}
                className="w-full text-left text-xs bg-white hover:bg-[#F8E9EB] hover:text-[#8F1D2C] border border-[#E7E7E7] rounded-xl px-2.5 py-1.5 transition-colors truncate"
              >
                📦 Tanya estimasi ongkir & stok perabot
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = createWhatsAppUrl('Halo Bu Ngatmin, apakah ada diskon grosir jika beli peralatan dapur & perlengkapan rumah dalam jumlah banyak?');
                  window.open(url, '_blank');
                  setIsOpen(false);
                }}
                className="w-full text-left text-xs bg-white hover:bg-[#F8E9EB] hover:text-[#8F1D2C] border border-[#E7E7E7] rounded-xl px-2.5 py-1.5 transition-colors truncate"
              >
                🍳 Tanya diskon pembelian banyak / grosir
              </button>
            </div>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendCustom} className="p-3 bg-white border-t border-[#E7E7E7] flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Ketik pesan Anda..."
              className="flex-1 bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3 py-2 text-xs text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#2E7D5B]"
            />
            <button
              type="submit"
              className="bg-[#2E7D5B] hover:bg-[#25664a] text-white p-2 rounded-xl transition-colors shadow-xs"
              aria-label="Kirim ke WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button Trigger */}
      <div className="flex items-center gap-2 group">
        {/* Tooltip on Desktop */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 bg-white text-[#242424] text-xs font-semibold px-3 py-2 rounded-full shadow-lg border border-[#E7E7E7] pointer-events-none group-hover:border-[#2E7D5B] transition-all">
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D5B]" />
            <span>Butuh bantuan? Chat kami</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-[#2E7D5B] hover:bg-[#25664a] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#2E7D5B]/30"
          id="floating-wa-button"
          aria-label="Buka Chat WhatsApp"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-7 h-7 fill-white text-transparent" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#2E7D5B] rounded-full"></span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
