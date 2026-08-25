import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Mail,
  Send,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { createWhatsAppUrl } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Tanya Stok & Ongkir',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Halo ${STORE_CONFIG.name}, saya ingin bertanya:\n\n`;
    text += `• Nama: ${formData.name || '—'}\n`;
    text += `• No. HP: ${formData.phone || '—'}\n`;
    text += `• Topik: ${formData.topic}\n`;
    text += `• Pesan: ${formData.message || '—'}\n\n`;
    text += `Mohon dibantu informasinya ya. Terima kasih!`;

    const url = createWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directWaUrl = createWhatsAppUrl('Halo RumaRasa, saya ingin bertanya info perabot.');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Kontak & Workshop</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242424] tracking-tight">
          Hubungi Kami
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1.5 max-w-xl">
          Punya pertanyaan seputar ukuran perabot, estimasi pengiriman kargo, atau ingin berkunjung ke workshop kami di Bandung? Silakan hubungi kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E7E7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#2E7D5B] flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-base font-bold text-[#242424]">WhatsApp Resmi (Fast Response)</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Konsultasi pesanan, cek stok terkini, dan konfirmasi ongkir kargo terbaik.
            </p>
            <p className="text-sm font-bold text-[#2E7D5B]">
              {STORE_CONFIG.whatsappDisplayNumber}
            </p>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2E7D5B] hover:bg-[#25664a] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              Chat WhatsApp Sekarang
            </a>
          </div>

          {/* Workshop Location */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E7E7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#242424]">Alamat Workshop & Studio</h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {STORE_CONFIG.address.fullAddress}
            </p>
            <a
              href={STORE_CONFIG.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1D2C] hover:underline"
            >
              Lihat Rute di Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Hours & Social */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E7E7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAFAF9] text-[#242424] flex items-center justify-center font-bold border border-[#E7E7E7]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#242424]">Jam Operasional Layanan</h3>
            <div className="text-xs text-[#667085] space-y-1">
              <p>• {STORE_CONFIG.openingHours.weekdays}</p>
              <p>• {STORE_CONFIG.openingHours.saturday}</p>
              <p>• {STORE_CONFIG.openingHours.sunday}</p>
            </div>
            <div className="pt-2 border-t border-[#E7E7E7] flex items-center gap-3 text-xs text-[#667085]">
              <Instagram className="w-4 h-4 text-[#8F1D2C]" />
              <a
                href={STORE_CONFIG.socials.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8F1D2C] font-medium"
              >
                {STORE_CONFIG.socials.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Direct Form via WhatsApp */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E7E7] shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1D2C] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Form Konsultasi
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242424]">
                Kirim Pesan Langsung ke WhatsApp
              </h2>
              <p className="text-xs text-[#667085] mt-1">
                Isi form berikut, dan browser Anda akan otomatis membuka WhatsApp dengan draf pertanyaan siap kirim.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#242424] block mb-1.5">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rina Melati"
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#242424] block mb-1.5">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxx"
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#242424] block mb-1.5">
                    Topik Pertanyaan
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
                  >
                    <option value="Tanya Stok & Ongkir">Tanya Stok & Estimasi Ongkir</option>
                    <option value="Konsultasi Custom Ukuran">Konsultasi Custom Ukuran Perabot</option>
                    <option value="Pertanyaan Pengiriman & Ekspedisi">Pertanyaan Pengiriman & Ekspedisi</option>
                    <option value="Kerjasama & Pembelian Jumlah Banyak">Kerjasama / Pembelian Grosir</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#242424] block mb-1.5">
                  Isi Pesan / Pertanyaan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan apa yang ingin Anda tanyakan atau butuhkan..."
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#2E7D5B] hover:bg-[#25664a] text-white py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                Kirim via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
