import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { FAQS } from '../data/faqs';
import { STORE_CONFIG } from '../config/store';
import { createWhatsAppUrl, generateHelpInquiryMessage } from '../utils/whatsapp';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const categories = ['Semua', 'Pemesanan', 'Pembayaran', 'Pengiriman', 'Kualitas & Garansi', 'Custom'];

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCategory =
        activeCategory === 'Semua' || faq.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const directWaUrl = createWhatsAppUrl(generateHelpInquiryMessage());

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Tanya Jawab (FAQ)</span>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8E9EB] text-[#8F1D2C] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> PUSAT BANTUAN
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242424] tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] max-w-xl mx-auto leading-relaxed">
          Temukan jawaban cepat seputar cara pesan lewat WhatsApp, pengiriman kargo, metode pembayaran, hingga garansi produk.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pertanyaan... (contoh: ongkir, transfer, garansi)"
          className="w-full bg-white border border-[#E7E7E7] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] shadow-xs"
        />
        <Search className="w-5 h-5 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#8F1D2C] text-white shadow-xs'
                : 'bg-white text-[#242424] hover:bg-[#F8E9EB] border border-[#E7E7E7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E7E7E7] text-center text-xs text-[#667085]">
            Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}".
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#FAFAF9] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#8F1D2C] bg-[#F8E9EB] px-2 py-0.5 rounded-md uppercase shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#242424]">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#667085] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#8F1D2C]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#667085] leading-relaxed border-t border-[#E7E7E7]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom WhatsApp Help Banner */}
      <div className="bg-[#2E7D5B] text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-md">
        <h3 className="text-lg sm:text-xl font-bold">
          Belum Menemukan Jawaban yang Anda Cari?
        </h3>
        <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
          Hubungi admin kami langsung via WhatsApp untuk pertanyaan perabot custom atau info lainnya.
        </p>
        <div className="pt-2">
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#2E7D5B] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Tanya via WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
};
