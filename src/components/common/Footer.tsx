import React from 'react';
import {
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { STORE_CONFIG } from '../../config/store';
import { CATEGORIES } from '../../data/categories';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E7E7E7] text-[#242424] pt-12 pb-24 md:pb-12 mt-16">
      {/* Top Value Assurance Banner */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-10 border-b border-[#E7E7E7]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#242424]">Pengrajin & Pabrik Pilihan</h4>
              <p className="text-[11px] text-[#667085] mt-0.5 leading-relaxed">
                Produk awet berkualitas, bahan tebal, dan sudah teruji dipakai harian.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#242424]">Chat Langsung Bu Ngatmin</h4>
              <p className="text-[11px] text-[#667085] mt-0.5 leading-relaxed">
                Tanya stok, diskon, & konfirmasi pengiriman langsung dalam ruang chat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#242424]">Pengiriman Seluruh RI</h4>
              <p className="text-[11px] text-[#667085] mt-0.5 leading-relaxed">
                Dukungan kargo terpercaya, instant kurir, dan ekspedisi aman terjangkau.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#242424]">Garansi Sampai Tujuan</h4>
              <p className="text-[11px] text-[#667085] mt-0.5 leading-relaxed">
                Jaminan ganti barang jika ada kendala atau pecah saat pengiriman ekspedisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs text-[#667085] leading-relaxed max-w-sm">
              {STORE_CONFIG.description}
            </p>

            <div className="pt-2">
              <a
                href="#/chat"
                className="inline-flex items-center gap-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mulai Chat Bu Ngatmin</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div>
            <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3.5">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li>
                <a href="#/" className="hover:text-[#8F1D2C] transition-colors">
                  Katalog Perabot
                </a>
              </li>
              <li>
                <a href="#/products" className="hover:text-[#8F1D2C] transition-colors">
                  Semua Produk
                </a>
              </li>
              <li>
                <a href="#/chat" className="hover:text-[#8F1D2C] transition-colors">
                  Chat Bu Ngatmin
                </a>
              </li>
              <li>
                <a href="#/about" className="hover:text-[#8F1D2C] transition-colors">
                  Tentang Bu Ngatmin
                </a>
              </li>
              <li>
                <a href="#/faq" className="hover:text-[#8F1D2C] transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Kategori Populer */}
          <div>
            <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3.5">
              Kategori Perabot
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#/category/${cat.slug}`}
                    className="hover:text-[#8F1D2C] transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Lokasi & Jam Operasional */}
          <div>
            <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3.5">
              Workshop & Toko
            </h4>
            <div className="space-y-3 text-xs text-[#667085]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8F1D2C] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {STORE_CONFIG.address.fullAddress}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8F1D2C] shrink-0 mt-0.5" />
                <div>
                  <p>{STORE_CONFIG.openingHours.weekdays}</p>
                  <p>{STORE_CONFIG.openingHours.saturday}</p>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={STORE_CONFIG.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8F1D2C] hover:underline"
                >
                  Buka di Google Maps <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Subtle Hidden Admin Icon */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 border-t border-[#E7E7E7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
        <p>© 2026 {STORE_CONFIG.name}. Hak Cipta Dilindungi. Melayani Eceran & Grosir.</p>
        
        {/* Subtle, unnoticeable Admin Entry Icon for Store Owner only */}
        <div className="flex items-center gap-2">
          <a
            href="#/admin"
            className="p-1 text-[#CBD5E1] hover:text-[#8F1D2C] opacity-30 hover:opacity-100 transition-all rounded-md"
            title=""
            aria-label="Admin"
            id="footer-admin-link"
          >
            <Lock className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
