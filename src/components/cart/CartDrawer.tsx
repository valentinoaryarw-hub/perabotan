import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/currency';
import { navigateTo } from '../../utils/router';
import { OptimizedImage } from '../common/OptimizedImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } =
    useCart();
  const { startOrGetConversation, sendMessage } = useChat();
  const { user, requireAuth } = useAuth();
  const [buyerNotes, setBuyerNotes] = useState('');

  if (!isOpen) return null;

  const handleCheckoutViaChat = () => {
    if (items.length === 0) return;

    requireAuth(() => {
      // Build order summary message
      const itemsListText = items
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product.name}* (${item.quantity} unit) - ${formatRupiah(
              item.unitPrice * item.quantity
            )}`
        )
        .join('\n');

      const fullMessage = `Halo Toko Perabotan Bu Ngatmin, saya ingin pesan produk dari Troli Belanja:\n\n${itemsListText}\n\n*Total Estimasi: ${formatRupiah(
        totalPrice
      )}*\n${buyerNotes ? `Catatan: ${buyerNotes}\n` : ''}\nMohon konfirmasi ketersediaan stok dan ongkir ya Bu Ngatmin. Terima kasih!`;

      // Start conversation with the primary item snapshot
      const primaryProduct = items[0].product;
      const conv = startOrGetConversation(primaryProduct, fullMessage);

      onClose();
      navigateTo('#/chat');
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-[#E7E7E7] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#242424]">Troli Belanja</h2>
                <p className="text-[11px] text-[#667085]">
                  {totalItems} item dipilih • Siap dibahas di Chat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-rose-600 hover:underline px-2 py-1"
                >
                  Kosongkan
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[#667085] hover:text-[#242424] rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Tutup Troli"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#E7E7E7] space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#242424]">Troli Anda Masih Kosong</h3>
                  <p className="text-xs text-[#667085] max-w-xs mt-1">
                    Jelajahi perabot rumah tangga pilihan dan klik tombol "+ Troli" pada produk yang Anda sukai.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigateTo('#/products');
                  }}
                  className="px-5 py-2.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  Buka Katalog Perabot
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  <OptimizedImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    widthParam={160}
                    qualityParam={75}
                    className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-xl border border-[#E7E7E7] bg-[#FAFAF9] shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onClose();
                          navigateTo(`#/product/${item.product.slug}`);
                        }}
                        className="text-xs sm:text-sm font-bold text-[#242424] hover:text-[#8F1D2C] cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#667085] hover:text-rose-600 p-1 transition-colors"
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-[#8F1D2C] mt-0.5">
                      {formatRupiah(item.unitPrice)}
                    </div>

                    {/* Variant tags if any */}
                    {Object.keys(item.selectedVariants || {}).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedVariants).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[10px] bg-[#FAFAF9] border border-[#E7E7E7] px-1.5 py-0.5 rounded-md text-[#667085]"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#E7E7E7] rounded-xl bg-[#FAFAF9] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-[#242424] hover:bg-gray-200 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#242424]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#242424] hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#242424]">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Footer Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E7E7E7] bg-[#FAFAF9] space-y-3">
              {/* Optional Buyer Note */}
              <div>
                <input
                  type="text"
                  value={buyerNotes}
                  onChange={(e) => setBuyerNotes(e.target.value)}
                  placeholder="Catatan pesanan (contoh: minta warna cokelat muda / kirim lusa)"
                  className="w-full bg-white border border-[#E7E7E7] rounded-xl px-3 py-2 text-xs text-[#242424] placeholder-[#8C95A6] focus:outline-hidden focus:border-[#8F1D2C]"
                />
              </div>

              {/* Subtotal */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#667085]">
                  <span>Total Produk ({totalItems} item):</span>
                  <span className="font-semibold text-[#242424]">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[#242424] pt-2 border-t border-[#E7E7E7]">
                  <span className="font-bold text-sm">Estimasi Total:</span>
                  <span className="text-base font-extrabold text-[#8F1D2C]">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Chat Checkout Button */}
              <button
                type="button"
                onClick={handleCheckoutViaChat}
                className="w-full py-3.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                id="cart-checkout-chat-btn"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Bawa Pesanan ke Chat Penjual</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#667085] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2E7D5B]" />
                  Garansi Sampai Tujuan
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#8F1D2C]" />
                  Cek Ongkir di Chat
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
