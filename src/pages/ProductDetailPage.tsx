import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  Heart,
  ChevronRight,
  Share2,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { formatRupiah, calculateDiscountPercentage } from '../utils/currency';
import { ProductGrid } from '../components/product/ProductGrid';
import { navigateTo } from '../utils/router';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { products } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { requireAuth } = useAuth();
  const { startOrGetConversation } = useChat();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [copiedToast, setCopiedToast] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-[#242424]">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-[#667085]">
          Produk yang Anda cari mungkin sudah dihapus atau link tidak sesuai.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('#/')}
          className="inline-flex px-5 py-2.5 bg-[#8F1D2C] text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  // Initialize variants
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

  const discountPercent = calculateDiscountPercentage(
    product.price,
    product.discountPrice || product.price
  );

  const handleAddToCart = () => {
    addItem(product, quantity, currentVariants);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 2000);
  };

  const handleStartChat = (initialCustomMessage?: string) => {
    requireAuth(() => {
      startOrGetConversation(product, initialCustomMessage);
      navigateTo('#/chat');
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const quickQuestions = [
    'Apakah produk ini masih tersedia?',
    'Berapa harga untuk 2 pcs?',
    'Bisa dikirim ke daerah saya?',
    'Saya tertarik dengan produk ini.',
    'Bisa custom warna / ukuran?',
  ];

  // Related Products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085] overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
        <a href="#/" className="hover:text-[#8F1D2C]">Katalog</a>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <a href={`#/products?category=${product.category}`} className="hover:text-[#8F1D2C]">
          {product.categoryName}
        </a>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#242424] font-semibold truncate">{product.name}</span>
      </div>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-3xl sm:rounded-[32px] border border-[#E7E7E7] p-5 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Product Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAFAF9] border border-[#E7E7E7] shadow-xs">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#8F1D2C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {product.badge}
                </span>
              )}

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2.5 bg-white/90 hover:bg-white text-[#242424] rounded-full shadow-md transition-all hover:scale-105"
                  title="Bagikan link produk"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2.5 bg-white/90 hover:bg-white text-[#242424] rounded-full shadow-md transition-all hover:scale-105"
                  title="Simpan ke Favorit"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorited ? 'fill-[#8F1D2C] text-[#8F1D2C]' : 'text-[#667085]'
                    }`}
                  />
                </button>
              </div>

              {copiedToast && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#242424] text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                  Link produk disalin!
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#8F1D2C] ring-2 ring-[#8F1D2C]/20 scale-102'
                        : 'border-[#E7E7E7] hover:border-gray-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Chat Action */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8F1D2C] uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-[#667085] font-normal">
                    ({product.reviewCount} ulasan • {product.soldCount}+ terjual)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="bg-[#FAFAF9] p-4 rounded-2xl border border-[#E7E7E7] flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#8F1D2C]">
                  {formatRupiah(currentUnitPrice)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-[#667085] line-through">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Hemat {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs text-[#2E7D5B] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B] animate-pulse"></span>
                <span>Stok Tersedia ({product.stock} unit siap dikirim)</span>
              </div>

              {/* Short snippet */}
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#E7E7E7]">
                  {product.variants.map((v) => (
                    <div key={v.id} className="space-y-2">
                      <label className="text-xs font-bold text-[#242424] flex items-center justify-between">
                        <span>Pilihan {v.name}:</span>
                        <span className="text-[#8F1D2C] font-semibold">
                          {currentVariants[v.name]}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((option) => {
                          const isSelected = currentVariants[v.name] === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [v.name]: option,
                                }))
                              }
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                isSelected
                                  ? 'bg-[#8F1D2C] text-white border-[#8F1D2C] shadow-xs'
                                  : 'bg-[#FAFAF9] text-[#242424] border-[#E7E7E7] hover:border-gray-400'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUANTITY & PRIMARY ACTION SECTION */}
            <div className="space-y-4 pt-6 border-t border-[#E7E7E7]">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#242424]">Jumlah Pembelian:</span>
                <div className="flex items-center border border-[#E7E7E7] rounded-2xl bg-[#FAFAF9] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-[#242424] hover:bg-gray-200 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#242424]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#242424] hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DUAL ACTION BUTTONS: + TAMBAH KE TROLI & CHAT SELLER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Button 1: Tambah ke Troli */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-sm font-bold border-2 transition-all active:scale-98 shadow-xs cursor-pointer ${
                    addedToCartToast
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                      : 'bg-white hover:bg-[#F8E9EB] text-[#8F1D2C] border-[#8F1D2C]'
                  }`}
                  id="product-detail-add-cart-btn"
                >
                  {addedToCartToast ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-600" />
                      <span>Berhasil Masuk Troli!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>+ Tambah ke Troli</span>
                    </>
                  )}
                </button>

                {/* Button 2: Chat Seller */}
                <button
                  type="button"
                  onClick={() => handleStartChat()}
                  className="flex items-center justify-center gap-2 bg-[#8F1D2C] hover:bg-[#64121D] text-white py-3.5 px-5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                  id="product-detail-chat-seller-btn"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>💬 Chat Seller</span>
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider">
                  Mulai percakapan dengan pertanyaan cepat:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleStartChat(q)}
                      className="text-xs bg-[#FAFAF9] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] text-[#242424] border border-[#E7E7E7] hover:border-[#8F1D2C]/30 px-3 py-1.5 rounded-full transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#667085] text-center pt-1">
                Diskusi harga, custom ukuran, cek ongkir, & finalisasi transaksi langsung lewat chat dengan Bu Ngatmin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Description Card */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-[#242424]">Deskripsi & Spesifikasi Produk</h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-3 text-xs sm:text-sm text-[#667085] leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="md:col-span-5 bg-[#FAFAF9] p-4 sm:p-5 rounded-2xl border border-[#E7E7E7]">
            <h4 className="font-bold text-xs text-[#242424] uppercase tracking-wider mb-3">
              Rincian Spesifikasi:
            </h4>
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#E7E7E7]">
                  <td className="py-2 font-medium text-[#667085] w-2/5">Material</td>
                  <td className="py-2 font-semibold text-[#242424]">{product.specifications.material}</td>
                </tr>
                <tr className="border-b border-[#E7E7E7]">
                  <td className="py-2 font-medium text-[#667085]">Dimensi</td>
                  <td className="py-2 font-semibold text-[#242424]">{product.specifications.dimensions}</td>
                </tr>
                <tr className="border-b border-[#E7E7E7]">
                  <td className="py-2 font-medium text-[#667085]">Berat</td>
                  <td className="py-2 font-semibold text-[#242424]">{product.specifications.weight}</td>
                </tr>
                <tr className="border-b border-[#E7E7E7]">
                  <td className="py-2 font-medium text-[#667085]">Warna</td>
                  <td className="py-2 font-semibold text-[#242424]">{product.specifications.color}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-[#667085]">Perakitan</td>
                  <td className="py-2 font-semibold text-[#242424]">
                    {product.specifications.assemblyRequired ? 'Perlu Dirakit' : 'Siap Pakai'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#242424]">Produk Pilihan Lainnya</h3>
            <a
              href="#/"
              className="text-xs font-bold text-[#8F1D2C] hover:underline"
            >
              Lihat Semua Katalog →
            </a>
          </div>

          <ProductGrid
            products={relatedProducts}
            columnsDesktop="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          />
        </div>
      )}
    </div>
  );
};
