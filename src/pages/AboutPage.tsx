import React from 'react';
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Truck,
  MessageCircle,
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { createWhatsAppUrl, generateHelpInquiryMessage } from '../utils/whatsapp';
import buNgatminLogoImg from '../assets/images/bu_ngatmin_logo_1787711070554.jpg';

export const AboutPage: React.FC = () => {
  const directWaUrl = createWhatsAppUrl(generateHelpInquiryMessage());

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-12 sm:space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Tentang Bu Ngatmin</span>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E7E7E7] p-6 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8E9EB] text-[#8F1D2C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Cerita Perabotan Bu Ngatmin
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#242424] tracking-tight leading-tight">
            "Perabotan Lengkap, Murah, dan Awet untuk Rumah Tangga Nyaman."
          </h1>
          <p className="text-xs sm:text-base text-[#667085] leading-relaxed pt-2">
            Toko Perabotan Bu Ngatmin berdedikasi menyediakan segala perlengkapan rumah tangga harian: mulai dari panci, gayung, piring keramik/melamin, sendok garpu, sapu lidi & sapu ijuk, pengki, ember tebal, baskom serbaguna, hingga toples kedap udara.
          </p>
        </div>
      </div>

      {/* Our Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-[#8F1D2C] uppercase tracking-wider">
            Kisah Toko Bu Ngatmin
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
            Melayani Kebutuhan Rumah Tangga dengan Senyuman & Harga Merakyat
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#667085] leading-relaxed">
            <p>
              Berawal dari warung perabotan sederhana di Bandung, Bu Ngatmin selalu memegang teguh komitmen: barang yang dijual harus awet, tebal, dan harganya ramah di kantong ibu-ibu dan keluarga.
            </p>
            <p>
              Kini toko kami hadir secara digital agar Anda bisa memesan perabotan kecil maupun kebutuhan rumah tangga secara praktis, memasukkannya ke troli belanja, atau langsung berdiskusi dan negosiasi ramah via chat dengan Bu Ngatmin.
            </p>
            <p>
              Semua barang selalu kami cek kelengkapan dan kondisinya sebelum dikemas rapi dengan kardus & bubble wrap tebal agar sampai dengan selamat tanpa ada yang penyok atau pecah.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-[#E7E7E7] bg-white flex items-center justify-center p-4">
          <img
            src={buNgatminLogoImg}
            alt="Toko Perabotan Bu Ngatmin"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#8F1D2C] uppercase tracking-wider">
            KEUNGGULAN TOKO
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight mt-1">
            Mengapa Belanja di Bu Ngatmin?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Barang Asli & Berkualitas</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Material plastik food grade tebal, stainless steel anti karat, dan anyaman lidi/ijuk rapat tidak gampang rontok.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Harga Grosir & Eceran</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Harga bersahabat untuk belanja satuan maupun belanja perlengkapan rumah/kost dalam jumlah besar.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Chat Ramah Bu Ngatmin</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Bisa langsung konsultasi ukuran panci, warna gayung/ember, dan tanya ongkir termurah langsung di website.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#8F1D2C] text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Mau Tanya atau Pesan Perabot?
        </h3>
        <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto mb-6 leading-relaxed">
          Bu Ngatmin siap melayani dengan senang hati. Chat sekarang atau masukkan ke troli belanja Anda.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#8F1D2C] hover:bg-[#F8E9EB] px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Chat Bu Ngatmin (WhatsApp)
          </a>
          <a
            href="#/products"
            className="inline-flex items-center gap-2 bg-[#64121D] hover:bg-black/30 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold border border-white/20 transition-all"
          >
            Lihat Katalog Perabot <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

