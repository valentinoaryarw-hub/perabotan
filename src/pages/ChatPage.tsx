import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  CheckCheck,
  Store,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatRupiah } from '../utils/currency';
import { navigateTo } from '../utils/router';

export const ChatPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    finalizeDeal,
    markAsRead,
  } = useChat();

  const { activeRole, requireAuth } = useAuth();

  const [inputMessage, setInputMessage] = useState('');
  const [showMobileList, setShowMobileList] = useState(() => {
    // If there is an active conversation already selected (e.g. user clicked "Chat Penjual"), don't show list on mobile
    return !activeConversationId;
  });
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealQuantity, setDealQuantity] = useState(1);
  const [dealCustomPrice, setDealCustomPrice] = useState<number | ''>('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Active conversation object
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto-scroll ONLY the inner message container without jumping the whole window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeConversation?.id, activeConversation?.messages?.length]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (activeConversationId) {
      markAsRead(activeConversationId, activeRole);
    }
  }, [activeConversationId, activeRole]);

  const handleSelectConversation = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveConversationId(id);
    setShowMobileList(false);
    markAsRead(id, activeRole);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || !activeConversation) return;

    requireAuth(() => {
      sendMessage(activeConversation.id, text, activeRole);
      setInputMessage('');
    });
  };

  const handleSendQuickQuestion = (question: string) => {
    if (!activeConversation) return;
    requireAuth(() => {
      sendMessage(activeConversation.id, question, activeRole);
    });
  };

  const handleOpenDealModal = () => {
    if (!activeConversation?.productSnapshot) return;
    setDealQuantity(1);
    setDealCustomPrice(
      activeConversation.productSnapshot.discountPrice ||
        activeConversation.productSnapshot.price
    );
    setIsDealModalOpen(true);
  };

  const handleConfirmDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !activeConversation.productSnapshot) return;

    const unitPrice =
      typeof dealCustomPrice === 'number'
        ? dealCustomPrice
        : activeConversation.productSnapshot.discountPrice ||
          activeConversation.productSnapshot.price;
    const totalPrice = unitPrice * dealQuantity;

    finalizeDeal(activeConversation.id, {
      productName: activeConversation.productSnapshot.name,
      quantity: dealQuantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
    });

    setIsDealModalOpen(false);
  };

  const quickQuestions = [
    'Apakah barang ini ready stok?',
    'Bisa kirim ke alamat saya?',
    'Apakah packing bubble wrap & kardus aman?',
    'Bisa dapat diskon untuk beli lebih dari 2?',
    'Saya ingin sepakati pesanan ini.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6">
      {/* Top Bar Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E7E7] p-3 sm:p-4 mb-3 sm:mb-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-[#242424] leading-tight">
              Pesan & Tanya Penjual
            </h1>
            <p className="text-[11px] sm:text-xs text-[#667085]">
              {activeRole === 'seller'
                ? 'Mode Penjual Toko: Membalas pertanyaan & rekap pesanan pelanggan'
                : 'Konsultasi produk, stok, & promo langsung dengan Perabotan Bu Ngatmin'}
            </p>
          </div>
        </div>

        {activeRole === 'seller' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8F1D2C] text-white rounded-xl text-xs font-bold shadow-xs">
            <Store className="w-3.5 h-3.5" />
            <span>Admin Penjual</span>
          </div>
        )}
      </div>

      {/* Main Dual-Pane Chat Layout */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E7E7E7] shadow-xs overflow-hidden h-[calc(100dvh-200px)] min-h-[480px] max-h-[750px] flex">
        {/* LEFT PANE: CONVERSATION LIST */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-[#E7E7E7] flex flex-col shrink-0 bg-[#FAFAF9]/50 ${
            !showMobileList ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Conversation List Header */}
          <div className="p-3 sm:p-4 border-b border-[#E7E7E7] flex items-center justify-between bg-white">
            <h2 className="text-xs sm:text-sm font-bold text-[#242424]">
              Daftar Obrolan ({conversations.length})
            </h2>
            <a
              href="#/products"
              className="text-[11px] font-semibold text-[#8F1D2C] hover:underline"
            >
              + Cari Produk
            </a>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7]">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                Belum ada obrolan. Silakan pilih produk di katalog lalu klik "Tanya Penjual".
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                const unread =
                  activeRole === 'seller'
                    ? conv.unreadBySeller
                    : conv.unreadByCustomer;

                return (
                  <div
                    key={conv.id}
                    onClick={(e) => handleSelectConversation(conv.id, e)}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all flex items-start gap-3 hover:bg-white ${
                      isSelected
                        ? 'bg-white border-l-4 border-[#8F1D2C] shadow-2xs'
                        : 'bg-transparent'
                    }`}
                  >
                    {/* User / Store Avatar */}
                    <div className="relative shrink-0">
                      {activeRole === 'seller' ? (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FAFAF9] border border-[#E7E7E7] text-[#8F1D2C] flex items-center justify-center font-bold text-sm shadow-xs">
                          {conv.customerName ? conv.customerName.charAt(0).toUpperCase() : 'P'}
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#8F1D2C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          BN
                        </div>
                      )}
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8F1D2C] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                          {unread}
                        </span>
                      )}
                    </div>

                    {/* Chat Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[#242424] truncate">
                          {activeRole === 'seller' ? conv.customerName : 'Perabotan Bu Ngatmin'}
                        </h4>
                        <span className="text-[10px] text-[#667085] shrink-0">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString(
                            'id-ID',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>

                      {/* Product Tag */}
                      {conv.productSnapshot && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#8F1D2C] font-semibold bg-[#F8E9EB] px-1.5 py-0.5 rounded-md truncate max-w-full mb-1">
                          <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{conv.productSnapshot.name}</span>
                        </div>
                      )}

                      {/* Last Message Snippet */}
                      <p
                        className={`text-xs truncate ${
                          unread > 0
                            ? 'font-bold text-[#242424]'
                            : 'text-[#667085]'
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: ACTIVE CONVERSATION */}
        {activeConversation ? (
          <div
            className={`w-full flex-1 flex flex-col bg-[#FDFBF7]/30 ${
              showMobileList ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* 1. TOP CHAT HEADER */}
            <div className="p-3 sm:p-4 bg-white border-b border-[#E7E7E7] flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back to list button */}
                <button
                  type="button"
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-1.5 -ml-1 text-[#667085] hover:text-[#242424] rounded-xl hover:bg-gray-100 cursor-pointer"
                  aria-label="Kembali ke daftar pesan"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-[#8F1D2C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {activeRole === 'seller' ? 'CS' : 'BN'}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#242424] truncate flex items-center gap-1.5">
                    {activeRole === 'seller'
                      ? activeConversation.customerName
                      : 'Perabotan Bu Ngatmin'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#2E7D5B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D5B]"></span>
                    <span>Online • Respon Cepat</span>
                  </div>
                </div>
              </div>

              {/* Deal / Rekap Pesanan Action Button */}
              <button
                type="button"
                onClick={handleOpenDealModal}
                className="px-3 py-1.5 bg-[#F8E9EB] hover:bg-[#8F1D2C] text-[#8F1D2C] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Sepakati pesanan atau rekap nilai pembelian"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sepakati Pesanan</span>
                <span className="sm:hidden">Sepakat</span>
              </button>
            </div>

            {/* 2. ATTACHED PRODUCT CONTEXT CARD */}
            {activeConversation.productSnapshot && (
              <div className="bg-white border-b border-[#E7E7E7] px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={activeConversation.productSnapshot.image}
                    alt={activeConversation.productSnapshot.name}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[#E7E7E7] bg-[#FAFAF9] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#667085] uppercase tracking-wider font-semibold">
                      Konteks Produk:
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#242424] truncate">
                      {activeConversation.productSnapshot.name}
                    </h4>
                    <div className="text-xs font-extrabold text-[#8F1D2C]">
                      {formatRupiah(
                        activeConversation.productSnapshot.discountPrice ||
                          activeConversation.productSnapshot.price
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo(`#/product/${activeConversation.productSnapshot?.slug}`)
                  }
                  className="px-2.5 sm:px-3 py-1.5 bg-[#FAFAF9] hover:bg-[#F8E9EB] text-[#242424] hover:text-[#8F1D2C] border border-[#E7E7E7] rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">Lihat Produk</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* 3. MESSAGE THREAD CONTAINER (Self-scrolling internally) */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
            >
              {/* Start info greeting */}
              <div className="text-center my-2">
                <span className="inline-block bg-white border border-[#E7E7E7] text-[#667085] text-[11px] px-3 py-1 rounded-full shadow-2xs">
                  💬 Obrolan langsung dengan Bu Ngatmin. Tanyakan stok perabotan, ukuran, diskon, atau buat rekap pesanan.
                </span>
              </div>

              {activeConversation.messages.map((msg) => {
                const isMe =
                  (activeRole === 'customer' && msg.senderRole === 'customer') ||
                  (activeRole === 'seller' && msg.senderRole === 'seller');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isMe ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* Sender Name only (no username) */}
                    <span className="text-[10px] text-[#667085] mb-1 px-1 font-medium">
                      {msg.senderRole === 'seller'
                        ? 'Perabotan Bu Ngatmin'
                        : msg.senderName}
                    </span>

                    {/* Message Bubble or Order Agreement Card */}
                    {msg.isOrderSummary && msg.orderSummaryDetails ? (
                      <div className="max-w-xs sm:max-w-md bg-white border-2 border-[#8F1D2C] rounded-2xl p-3 sm:p-4 shadow-sm text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-[#8F1D2C] font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 fill-[#8F1D2C] text-white" />
                          <span>KESEPAKATAN PESANAN DISETUJUI</span>
                        </div>
                        <div className="text-xs sm:text-sm text-[#242424] font-semibold">
                          {msg.orderSummaryDetails.productName}
                        </div>
                        <div className="bg-[#FAFAF9] p-2.5 rounded-xl border border-[#E7E7E7] text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[#667085]">Jumlah:</span>
                            <span className="font-bold">{msg.orderSummaryDetails.quantity} unit</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#667085]">Harga Satuan:</span>
                            <span className="font-bold">
                              {formatRupiah(msg.orderSummaryDetails.unitPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-[#E7E7E7] text-[#8F1D2C]">
                            <span className="font-bold">Total Disepakati:</span>
                            <span className="font-extrabold text-sm">
                              {formatRupiah(msg.orderSummaryDetails.totalPrice)}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#667085]">
                          ✅ Rincian pesanan telah disepakati penjual & pembeli di ruang obrolan ini.
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`max-w-xs sm:max-w-md px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isMe
                            ? 'bg-[#8F1D2C] text-white rounded-br-xs'
                            : 'bg-white border border-[#E7E7E7] text-[#242424] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className="text-[9px] text-[#667085] mt-1 px-1 flex items-center gap-1">
                      {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {isMe && <CheckCheck className="w-3 h-3 text-[#8F1D2C]" />}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 4. QUICK SUGGESTION CHIPS */}
            {activeRole === 'customer' && (
              <div className="px-3 sm:px-4 py-2 bg-white border-t border-[#E7E7E7] overflow-x-auto no-scrollbar flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#667085] whitespace-nowrap uppercase tracking-wider mr-1">
                  Tanya Cepat:
                </span>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuickQuestion(q)}
                    className="text-[11px] bg-[#FAFAF9] hover:bg-[#F8E9EB] hover:text-[#8F1D2C] text-[#242424] border border-[#E7E7E7] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* 5. MESSAGE INPUT FORM */}
            <div className="p-2.5 sm:p-4 bg-white border-t border-[#E7E7E7]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    activeRole === 'customer'
                      ? 'Ketik pesan, tawar harga, atau tanya spesifikasi perabot...'
                      : 'Ketik balasan untuk pembeli...'
                  }
                  className="flex-1 bg-[#FAFAF9] border border-[#E7E7E7] rounded-2xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-[#242424] placeholder-[#667085] focus:outline-hidden focus:border-[#8F1D2C] focus:bg-white transition-all shadow-2xs"
                  id="chat-message-input"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="h-10 sm:h-11 px-3.5 sm:px-5 bg-[#8F1D2C] hover:bg-[#64121D] disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0 active:scale-95 cursor-pointer"
                  id="chat-send-btn"
                >
                  <span>Kirim</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#242424]">Pilih Obrolan</h3>
            <p className="text-xs text-[#667085] max-w-xs">
              Pilih salah satu percakapan di sebelah kiri atau buka katalog perabot untuk mulai chat dengan Bu Ngatmin.
            </p>
          </div>
        )}
      </div>

      {/* DEAL / ORDER AGREEMENT MODAL */}
      {isDealModalOpen && activeConversation?.productSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E7E7E7] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E7E7]">
              <h3 className="text-sm sm:text-base font-bold text-[#242424] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8F1D2C]" />
                <span>Sepakati / Rekap Pesanan</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDealModalOpen(false)}
                className="text-[#667085] hover:text-[#242424] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#FAFAF9] p-3 rounded-2xl border border-[#E7E7E7]">
              <img
                src={activeConversation.productSnapshot.image}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-[#E7E7E7]"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#242424] truncate">
                  {activeConversation.productSnapshot.name}
                </h4>
                <div className="text-xs text-[#8F1D2C] font-extrabold">
                  {formatRupiah(
                    activeConversation.productSnapshot.discountPrice ||
                      activeConversation.productSnapshot.price
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmDeal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#242424] block mb-1">
                  Jumlah Pesanan (Unit)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={dealQuantity}
                  onChange={(e) => setDealQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#242424]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242424] block mb-1">
                  Harga Satuan Disepakati (Rp)
                </label>
                <input
                  type="number"
                  value={dealCustomPrice}
                  onChange={(e) =>
                    setDealCustomPrice(
                      e.target.value === '' ? '' : parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full bg-[#FAFAF9] border border-[#E7E7E7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#242424]"
                />
                <span className="text-[10px] text-[#667085]">
                  Sesuaikan jika terdapat harga diskon atau harga grosir yang telah dibahas di chat.
                </span>
              </div>

              <div className="bg-[#F8E9EB] p-3 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-[#242424]">
                  <span>Total Nilai Kesepakatan:</span>
                  <span className="font-extrabold text-sm text-[#8F1D2C]">
                    {formatRupiah(
                      (typeof dealCustomPrice === 'number'
                        ? dealCustomPrice
                        : activeConversation.productSnapshot.price) * dealQuantity
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Kirim Kesepakatan ke Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
