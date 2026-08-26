import React from 'react';
import {
  User,
  MessageCircle,
  Heart,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useWishlist } from '../context/WishlistContext';
import { navigateTo } from '../utils/router';

export const ProfilePage: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { conversations, setActiveConversationId } = useChat();
  const { wishlistIds } = useWishlist();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto shadow-xs">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#242424]">Identitas Pelanggan</h2>
        <p className="text-xs sm:text-sm text-[#667085] max-w-sm mx-auto">
          Masukkan nama Anda untuk mengelola riwayat chat, wishlist, dan berkonsultasi langsung dengan penjual.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal()}
          className="px-6 py-3 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
        >
          Masukkan Nama / Masuk
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#8F1D2C] text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424]">
                {user.name}
              </h1>
              {user.phone ? (
                <p className="text-xs sm:text-sm text-[#667085] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#8F1D2C]" />
                  <span>{user.phone}</span>
                </p>
              ) : (
                <p className="text-xs text-[#2E7D5B] font-semibold mt-0.5">
                  ● Pelanggan Terhubung
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-[#FAFAF9] hover:bg-gray-200 text-[#242424] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E7E7E7] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Nama / Keluar</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#E7E7E7]">
          <div className="bg-[#FAFAF9] p-3.5 rounded-2xl border border-[#E7E7E7] text-center">
            <span className="text-[11px] text-[#667085] block">Diskusi Chat</span>
            <span className="text-lg font-extrabold text-[#242424]">
              {conversations.length}
            </span>
          </div>
          <div className="bg-[#FAFAF9] p-3.5 rounded-2xl border border-[#E7E7E7] text-center">
            <span className="text-[11px] text-[#667085] block">Favorit Disimpan</span>
            <span className="text-lg font-extrabold text-[#242424]">
              {wishlistIds.length}
            </span>
          </div>
          <div className="bg-[#FAFAF9] p-3.5 rounded-2xl border border-[#E7E7E7] text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[#667085] block">Status Pelanggan</span>
            <span className="text-xs font-extrabold text-[#2E7D5B] block mt-1">
              Aktif & Terhubung
            </span>
          </div>
        </div>
      </div>

      {/* Recent Chat Discussions */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#242424] flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#8F1D2C]" />
            <span>Riwayat Diskusi Produk</span>
          </h3>
          <a
            href="#/chat"
            className="text-xs font-bold text-[#8F1D2C] hover:underline"
          >
            Buka Ruang Chat →
          </a>
        </div>

        <div className="divide-y divide-[#E7E7E7]">
          {conversations.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#667085]">
              Belum ada obrolan. Silakan pilih perabot di katalog untuk mulai berdiskusi dengan penjual.
            </div>
          ) : (
            conversations.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveConversationId(c.id);
                  navigateTo('#/chat');
                }}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAFAF9] rounded-xl px-2 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {c.productSnapshot ? (
                    <img
                      src={c.productSnapshot.image}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-[#E7E7E7] bg-[#FAFAF9] shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center font-bold text-xs shrink-0">
                      BN
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#242424] truncate">
                      {c.productSnapshot ? c.productSnapshot.name : 'Perabotan Bu Ngatmin'}
                    </h4>
                    <p className="text-xs text-[#667085] truncate">
                      {c.lastMessage}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-[#667085] shrink-0">
                  {new Date(c.lastMessageTimestamp).toLocaleDateString('id-ID')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
