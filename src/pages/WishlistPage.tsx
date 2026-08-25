import React from 'react';
import { Heart, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { navigateTo } from '../utils/router';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts } = useWishlist();

  const favoriteProducts = wishlistProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Produk Favorit (Wishlist)</span>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E7]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
            Produk Tersimpan
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Daftar perabot favorit yang kamu simpan untuk ditinjau nanti.
          </p>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E7E7E7] p-8 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-18 h-18 rounded-full bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="text-xl font-bold text-[#242424] mb-2">
            Belum Ada Produk Favorit
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
            Klik ikon hati pada perabot yang kamu suka agar mudah ditemukan kembali saat ingin memesan.
          </p>
          <a
            href="#/products"
            className="inline-flex items-center gap-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Jelajahi Produk Sekarang
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {favoriteProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
