import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  Heart,
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
  index?: number;
  mobileAspect?: 'tall' | 'square' | 'wide' | 'auto';
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  mobileAspect = 'auto',
  className = '',
}) => {
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

  // Determine mobile aspect ratio variation to break parallel uniformity
  let mobileAspectClass = 'aspect-square sm:aspect-square';
  if (mobileAspect === 'tall') {
    mobileAspectClass = 'aspect-[4/5] sm:aspect-square';
  } else if (mobileAspect === 'wide') {
    mobileAspectClass = 'aspect-[4/3] sm:aspect-square';
  } else if (mobileAspect === 'square') {
    mobileAspectClass = 'aspect-square sm:aspect-square';
  } else if (index !== undefined) {
    // Alternating/staggered rhythm for organic mobile browsing
    if (index % 4 === 0 || index % 4 === 3) {
      mobileAspectClass = 'aspect-[4/5] sm:aspect-square';
    } else {
      mobileAspectClass = 'aspect-square sm:aspect-square';
    }
  }

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
      className={`group relative bg-white rounded-xl sm:rounded-2xl border border-[#E7E7E7] overflow-hidden hover:border-[#8F1D2C]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`}
      id={`product-card-${product.slug}`}
    >
      {/* Top Image Container */}
      <div className={`relative ${mobileAspectClass} w-full bg-[#FAFAF9] overflow-hidden`}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs ${
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
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWish}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#242424] flex items-center justify-center shadow-xs transition-all hover:scale-110"
          aria-label="Simpan ke Favorit"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              isFavorited
                ? 'fill-[#8F1D2C] text-[#8F1D2C]'
                : 'text-[#667085] hover:text-[#8F1D2C]'
            }`}
          />
        </button>

        {/* Quick Stock Indicator */}
        <div className="absolute bottom-2 left-2 sm:left-2.5 z-10">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium text-[#2E7D5B] border border-[#E7E7E7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]"></span>
            Stok: {product.stock}
          </span>
        </div>
      </div>

      {/* Content Info - Refined & Compact for High Density */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#667085] mb-1">
            <span className="truncate max-w-[100px] sm:max-w-[120px] font-semibold text-[#8F1D2C]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[9px] sm:text-[10px] text-[#667085] font-normal">
                ({product.soldCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-xs sm:text-[13px] text-[#242424] group-hover:text-[#8F1D2C] transition-colors line-clamp-2 leading-snug min-h-[32px] sm:min-h-[36px]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Specs */}
          <p className="text-[10px] sm:text-[11px] text-[#667085] line-clamp-1 mt-0.5">
            {product.specifications.material} • {product.specifications.dimensions}
          </p>
        </div>

        {/* Bottom Price & Dual Actions (Troli & Chat) */}
        <div className="pt-2 mt-1.5 border-t border-[#E7E7E7]/70 space-y-1.5">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-[#8F1D2C] tracking-tight truncate">
                {formatRupiah(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-[9px] sm:text-[10px] text-[#667085] line-through leading-none">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Tambah ke Troli & Chat Penjual */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 pt-0.5">
            {/* 1. Tambah ke Troli Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-7 sm:h-7.5 px-1 sm:px-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 transition-all border shadow-2xs active:scale-95 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#242424] hover:text-[#8F1D2C] border-[#E7E7E7]'
              }`}
              title="Tambahkan ke Troli Belanja"
            >
              {justAdded ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Ada</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8F1D2C] shrink-0" />
                  <span className="truncate">+ Troli</span>
                </>
              )}
            </button>

            {/* 2. Chat Seller Button */}
            <button
              type="button"
              onClick={handleQuickChat}
              className="h-7 sm:h-7.5 px-1 sm:px-1.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
              title="Chat Penjual tentang produk ini"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
