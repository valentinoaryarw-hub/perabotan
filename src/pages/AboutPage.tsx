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

export const AboutPage: React.FC = () => {
  const directWaUrl = createWhatsAppUrl(generateHelpInquiryMessage());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-12 sm:space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Tentang Kami</span>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl sm:rounded-[36px] border border-[#E7E7E7] p-6 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8E9EB] text-[#8F1D2C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Cerita RumaRasa
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#242424] tracking-tight leading-tight">
            "Berawal dari kebutuhan sederhana untuk rumah yang lebih nyaman."
          </h1>
          <p className="text-xs sm:text-base text-[#667085] leading-relaxed pt-2">
            RumaRasa adalah usaha perabot dan home-living lokal Indonesia yang lahir dari kecintaan kami terhadap hunian yang rapi, fungsional, dan menenangkan. Kami percaya bahwa memiliki rumah yang estetik tidak harus mahal dan rumit.
          </p>
        </div>
      </div>

      {/* Our Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-[#8F1D2C] uppercase tracking-wider">
            Kisah Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
            Menghubungkan Perajin Lokal dengan Kebutuhan Rumah Modern
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#667085] leading-relaxed">
            <p>
              Banyak perabot di pasaran yang harganya terlalu tinggi atau dibuat dengan bahan yang mudah rusak. Di RumaRasa, kami bekerja sama langsung dengan para pengrajin kayu, logam, dan anyaman lokal di Bandung, Tasikmalaya, dan Jepara.
            </p>
            <p>
              Setiap produk kami kurasi dan rancang untuk menjawab permasalahan nyata rumah tangga masa kini: ruangan terbatas, butuh penyimpanan fleksibel, dan ingin suasana rumah yang lebih hangat.
            </p>
            <p>
              Kami sengaja mempertahankan proses pemesanan sederhana melalui WhatsApp agar setiap pelanggan bisa berkomunikasi hangat secara personal, memastikan ukuran yang cocok, dan mendapatkan estimasi ongkir paling efisien.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-[#E7E7E7]">
          <img
            src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80"
            alt="Workshop Pengrajin Perabot RumaRasa"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#8F1D2C] uppercase tracking-wider">
            NILAI KAMI
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight mt-1">
            Prinsip yang Kami Pegang Teguh
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Jujur & Transparan</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Foto dan deskripsi produk apa adanya sesuai fisik asli. Spesifikasi material, dimensi, dan bobot dijabarkan dengan jelas.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Dukungan Pengrajin Lokal</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Memberdayakan bengkel kayu dan perajin keluarga Indonesia dengan standar kontrol kualitas dan bayaran yang adil.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#242424]">Pelayanan Ramah & Manusiawi</h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Anda tidak berbicara dengan robot. Tim customer care kami siap berdiskusi perihal kebutuhan ruang Anda.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#8F1D2C] text-white rounded-3xl p-8 sm:p-12 text-center shadow-lg">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Ingin Diskusi atau Tanya Perabot?
        </h3>
        <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto mb-6 leading-relaxed">
          Jangan ragu untuk menyapa kami. Tim RumaRasa siap menyambut Anda dengan hangat.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#8F1D2C] hover:bg-[#F8E9EB] px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            Chat WhatsApp Kami
          </a>
          <a
            href="#/products"
            className="inline-flex items-center gap-2 bg-[#64121D] hover:bg-black/30 text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold border border-white/20 transition-all"
          >
            Jelajahi Produk <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
