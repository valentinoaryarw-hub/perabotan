import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../utils/currency';
import { navigateTo } from '../utils/router';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } =
    useCart();
  const { startOrGetConversation } = useChat();
  const { requireAuth } = useAuth();
  const [buyerNotes, setBuyerNotes] = useState('');

  const handleCheckoutViaChat = () => {
    if (items.length === 0) return;

    requireAuth(() => {
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
      )}*\n${buyerNotes ? `Catatan: ${buyerNotes}\n` : ''}\nMohon info ketersediaan stok & ongkir ya Bu. Terima kasih!`;

      const primaryProduct = items[0].product;
      startOrGetConversation(primaryProduct, fullMessage);
      navigateTo('#/chat');
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#242424]">Troli Belanja Anda Kosong</h1>
        <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto">
          Belum ada perabot yang dimasukkan ke troli. Pilih perabot rumah tangga yang Anda sukai di katalog kami.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigateTo('#/products')}
            className="px-6 py-3 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98"
          >
            Mulai Belanja Perabot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#667085]">
        <a href="#/" className="hover:text-[#8F1D2C]">Beranda</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-semibold">Troli Belanja</span>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E7]">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424]">
          Troli Belanja ({totalItems} Item)
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 font-semibold hover:underline"
        >
          Kosongkan Troli
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E7E7E7] p-4 sm:p-6 shadow-xs divide-y divide-[#E7E7E7] space-y-4">
          {items.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-[#E7E7E7] bg-[#FAFAF9] shrink-0"
                />
                <div className="min-w-0">
                  <h3
                    onClick={() => navigateTo(`#/product/${item.product.slug}`)}
                    className="text-xs sm:text-sm font-bold text-[#242424] hover:text-[#8F1D2C] cursor-pointer truncate max-w-xs sm:max-w-md"
                  >
                    {item.product.name}
                  </h3>
                  <div className="text-xs font-bold text-[#8F1D2C] mt-0.5">
                    {formatRupiah(item.unitPrice)}
                  </div>
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
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center border border-[#E7E7E7] rounded-xl bg-[#FAFAF9] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-[#242424] hover:bg-gray-200 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-[#242424]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#242424] hover:bg-gray-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-xs sm:text-sm font-extrabold text-[#242424] block">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-[#667085] hover:text-rose-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Box */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E7E7E7] p-5 sm:p-6 shadow-xs h-fit space-y-5">
          <h2 className="text-base font-bold text-[#242424] pb-3 border-b border-[#E7E7E7]">
            Ringkasan Pembelian
          </h2>

          <div className="space-y-2.5 text-xs text-[#667085]">
            <div className="flex justify-between">
              <span>Total Item ({totalItems} unit):</span>
              <span className="font-semibold text-[#242424]">{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Konsultasi & Sepakat Harga:</span>
              <span className="text-[#2E7D5B] font-bold">Gratis via Chat</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim:</span>
              <span className="font-semibold text-[#242424]">Disesuaikan di Chat</span>
            </div>

            <div className="pt-3 border-t border-[#E7E7E7] flex justify-between items-baseline text-[#242424]">
              <span className="font-bold text-sm">Total Estimasi:</span>
              <span className="text-lg font-extrabold text-[#8F1D2C]">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#242424] block mb-1">
              Catatan Pesanan Khusus (Opsional):
            </label>
            <textarea
              rows={2}
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="Contoh: warna kayu walnut, kirim akhir pekan"
              className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl p-2.5 text-xs text-[#242424] focus:outline-hidden focus:border-[#8F1D2C]"
            />
          </div>

          <button
            type="button"
            onClick={handleCheckoutViaChat}
            className="w-full py-3.5 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Kirim Pesanan ke Chat Penjual</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 border-t border-[#E7E7E7] text-[11px] text-[#667085]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D5B] shrink-0" />
              <span>Garansi barang aman sampai di rumah</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8F1D2C] shrink-0" />
              <span>Dukungan kurir kargo & instan ekspedisi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
