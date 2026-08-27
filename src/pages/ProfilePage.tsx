import React from 'react';
import {
  User,
  MessageCircle,
  Heart,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Phone,
  Mail,
  CloudCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { navigateTo } from '../utils/router';

export const ProfilePage: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { conversations, setActiveConversationId } = useChat();
  const { wishlistIds } = useWishlist();
  const { totalItems } = useCart();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#F8E9EB] text-[#8F1D2C] flex items-center justify-center mx-auto shadow-xs">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#242424]">Identitas Pelanggan</h2>
        <p className="text-xs sm:text-sm text-[#667085] max-w-sm mx-auto">
          Masuk dengan Akun Google untuk menyimpan riwayat chat, troli belanja, dan berkonsultasi langsung dengan penjual.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal()}
          className="px-6 py-3 bg-[#8F1D2C] hover:bg-[#64121D] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98 cursor-pointer"
        >
          Masuk dengan Akun Google
        </button>
      </div>
    );
  }

  const isGoogleUser = !!user.email || (user.avatar && user.avatar.includes('googleusercontent.com'));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.avatar && user.avatar.startsWith('http') && !user.avatar.includes('dicebear') ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#8F1D2C]/20 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#8F1D2C] text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#242424]">
                  {user.name}
                </h1>
                {isGoogleUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Google
                  </span>
                )}
              </div>

              {user.email && (
                <p className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#8F1D2C]" />
                  <span>{user.email}</span>
                </p>
              )}

              {user.phone ? (
                <p className="text-xs sm:text-sm text-[#667085] flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#8F1D2C]" />
                  <span>{user.phone}</span>
                </p>
              ) : (
                <p className="text-xs text-[#2E7D5B] font-semibold mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Data Tersinkronisasi ke Firebase Cloud</span>
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
              <span>Keluar Akun</span>
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
            <span className="text-[11px] text-[#667085] block">Item di Troli</span>
            <span className="text-lg font-extrabold text-[#8F1D2C]">
              {totalItems}
            </span>
          </div>
          <div className="bg-[#FAFAF9] p-3.5 rounded-2xl border border-[#E7E7E7] text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-[#667085] block">Favorit Disimpan</span>
            <span className="text-lg font-extrabold text-[#242424]">
              {wishlistIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Chat Discussions */}
      <div className="bg-white rounded-3xl border border-[#E7E7E7] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#242424] flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#8F1D2C]" />
            <span>Riwayat Diskusi Produk ({conversations.length})</span>
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
            <div className="py-8 text-center text-xs text-[#667085] space-y-2">
              <p>Belum ada obrolan di akun Anda.</p>
              <p className="text-[11px] text-[#8C95A6]">
                Pilih produk di katalog kami dan klik "Chat Seller" untuk langsung terhubung dengan Bu Ngatmin.
              </p>
            </div>
          ) : (
            conversations.slice(0, 5).map((c) => (
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
