import React, { useState } from 'react';
import {
  X,
  Star,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatRupiah, calculateDiscountPercentage } from '../../utils/currency';
import { createWhatsAppUrl, generateDirectProductOrderMessage } from '../../utils/whatsapp';
import { navigateTo } from '../../utils/router';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);

  // Initialize variants if not yet set
  const currentVariants: Record<string, string> = { ...selectedVariants };
  if (product.variants) {
    product.variants.forEach((v) => {
      if (!currentVariants[v.name] && v.options.length > 0) {
        currentVariants[v.name] = v.options[0];
      }
    });
  }

  // Calculate dynamic unit price
  let currentUnitPrice = product.discountPrice || product.price;
  if (product.variants) {
    product.variants.forEach((v) => {
      const chosen = currentVariants[v.name];
      if (chosen && v.priceAdjustments && v.priceAdjustments[chosen]) {
        currentUnitPrice += v.priceAdjustments[chosen];
      }
    });
  }

  const discountPercent = calculateDiscountPercentage(product.price, product.discountPrice || product.price);

  const handleAddToCart = () => {
    addItem(product, quantity, currentVariants);
    setQuickViewProduct(null);
  };

  const directWaOrderUrl = createWhatsAppUrl(
    generateDirectProductOrderMessage(product, quantity, currentVariants)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E7E7E7] overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-[#242424] rounded-full flex items-center justify-center shadow-md border border-[#E7E7E7] transition-all hover:scale-105"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="w-full md:w-1/2 bg-[#FAFAF9] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E7E7]">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E7E7E7] flex items-center justify-center">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#8F1D2C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {product.badge}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md text-[#242424] transition-all"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? 'fill-[#8F1D2C] text-[#8F1D2C]' : 'text-[#667085]'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#8F1D2C] ring-2 ring-[#8F1D2C]/20'
                      : 'border-[#E7E7E7] hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & CTA */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
              <span className="uppercase tracking-wider font-semibold text-[#8F1D2C]">
                {product.categoryName}
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewCount} ulasan)
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#242424] leading-snug">
              {product.name}
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-2xl font-extrabold text-[#8F1D2C]">
                {formatRupiah(currentUnitPrice)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-sm text-[#667085] line-through">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                    Hemat {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="text-xs text-[#2E7D5B] font-medium mt-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Stok tersedia ({product.stock} unit) • {product.soldCount}+ terjual
            </div>

            <p className="text-xs text-[#667085] mt-3 leading-relaxed line-clamp-3">
              {product.shortDescription}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4 space-y-3 pt-3 border-t border-[#E7E7E7]">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <label className="text-xs font-semibold text-[#242424] block mb-1.5">
                      {variant.name}:{' '}
                      <span className="text-[#8F1D2C] font-normal">
                        {currentVariants[variant.name]}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = currentVariants[variant.name] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: opt,
                              }))
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? 'bg-[#8F1D2C] text-white border-[#8F1D2C] shadow-xs'
                                : 'bg-[#FAFAF9] text-[#242424] border-[#E7E7E7] hover:border-gray-400'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#E7E7E7]">
              <span className="text-xs font-semibold text-[#242424]">Jumlah:</span>
              <div className="flex items-center border border-[#E7E7E7] rounded-xl overflow-hidden bg-[#FAFAF9]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-sm text-[#242424] hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 py-1 text-xs font-bold text-[#242424] min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-2.5 py-1 text-sm text-[#242424] hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#667085]">
                Subtotal: <strong className="text-[#8F1D2C]">{formatRupiah(currentUnitPrice * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#E7E7E7] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-1.5 bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#8F1D2C] border-2 border-[#8F1D2C] py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                id="quickview-add-cart-btn"
              >
                <ShoppingCart className="w-4 h-4" />
                + Tambah ke Troli
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo(`#/product/${product.slug}`);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                id="quickview-chat-btn"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                💬 Chat Seller
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuickViewProduct(null);
                navigateTo(`#/product/${product.slug}`);
              }}
              className="w-full py-2 text-center text-xs font-semibold text-[#667085] hover:text-[#8F1D2C] hover:underline flex items-center justify-center gap-1"
            >
              Buka Halaman Lengkap Produk <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
