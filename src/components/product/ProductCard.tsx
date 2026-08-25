import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  Eye,
  Heart,
  Sparkles,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { formatRupiah, calculateDiscountPercentage } from '../../utils/currency';
import { navigateTo } from '../../utils/router';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { requireAuth } = useAuth();
  const { startOrGetConversation } = useChat();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercentage(
    product.price,
    product.discountPrice || product.price
  );

  const handleQuickChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    requireAuth(() => {
      startOrGetConversation(product);
      navigateTo('#/chat');
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigateTo(`#/product/${product.slug}`)}
      className="group relative bg-white rounded-2xl border border-[#E7E7E7] overflow-hidden hover:border-[#8F1D2C]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
      id={`product-card-${product.slug}`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-[#FAFAF9] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
                product.badge === 'BEST SELLER' || product.badge === 'TERLARIS'
                  ? 'bg-[#8F1D2C] text-white'
                  : product.badge === 'PRODUK BARU'
                  ? 'bg-[#2E7D5B] text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWish}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#242424] flex items-center justify-center shadow-xs transition-all hover:scale-110"
          aria-label="Simpan ke Favorit"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited
                ? 'fill-[#8F1D2C] text-[#8F1D2C]'
                : 'text-[#667085] hover:text-[#8F1D2C]'
            }`}
          />
        </button>

        {/* Quick Stock Indicator */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-medium text-[#2E7D5B] border border-[#E7E7E7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]"></span>
            Stok: {product.stock}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1">
            <span className="truncate max-w-[120px] font-semibold text-[#8F1D2C]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#667085] font-normal">
                ({product.soldCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-sm sm:text-base text-[#242424] group-hover:text-[#8F1D2C] transition-colors line-clamp-2 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Specs */}
          <p className="text-[11px] text-[#667085] line-clamp-1 mt-1">
            {product.specifications.material} • {product.specifications.dimensions}
          </p>
        </div>

        {/* Bottom Price & Dual Actions (Troli & Chat) */}
        <div className="pt-3 mt-2 border-t border-[#E7E7E7]/70 space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-extrabold text-[#8F1D2C] tracking-tight truncate">
                {formatRupiah(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-[10px] sm:text-[11px] text-[#667085] line-through leading-none">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Tambah ke Troli & Chat Penjual */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {/* 1. Tambah ke Troli Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-8 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all border shadow-2xs active:scale-95 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#242424] hover:text-[#8F1D2C] border-[#E7E7E7]'
              }`}
              title="Tambahkan ke Troli Belanja"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ada di Troli</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8F1D2C]" />
                  <span>+ Troli</span>
                </>
              )}
            </button>

            {/* 2. Chat Seller Button */}
            <button
              type="button"
              onClick={handleQuickChat}
              className="h-8 px-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
              title="Chat Penjual tentang produk ini"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
